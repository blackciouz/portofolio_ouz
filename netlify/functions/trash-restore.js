const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { id } = JSON.parse(event.body);
        
        if (!id) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Item ID required' })
            };
        }

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        // Get deleted item
        const { data: deletedItem, error: fetchError } = await supabase
            .from('deleted_items')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !deletedItem) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Item not found' })
            };
        }

        // Restore item by removing deleted_at timestamp
        const tableName = deletedItem.item_type === 'service' ? 'services' : 'projects';
        
        const { error: restoreError } = await supabase
            .from(tableName)
            .update({ deleted_at: null })
            .eq('id', deletedItem.item_id);

        if (restoreError) throw restoreError;

        // Remove from deleted_items
        const { error: deleteError } = await supabase
            .from('deleted_items')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: 'Item restored' })
        };

    } catch (error) {
        console.error('Restore error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to restore item', message: error.message })
        };
    }
};
