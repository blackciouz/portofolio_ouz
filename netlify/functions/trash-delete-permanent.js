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

        // Permanently delete from original table
        const tableName = deletedItem.item_type === 'service' ? 'services' : 'projects';
        
        const { error: deleteOriginalError } = await supabase
            .from(tableName)
            .delete()
            .eq('id', deletedItem.item_id);

        if (deleteOriginalError) throw deleteOriginalError;

        // Remove from deleted_items
        const { error: deleteTrashError } = await supabase
            .from('deleted_items')
            .delete()
            .eq('id', id);

        if (deleteTrashError) throw deleteTrashError;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: 'Item permanently deleted' })
        };

    } catch (error) {
        console.error('Permanent delete error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to delete item', message: error.message })
        };
    }
};
