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
        const { order } = JSON.parse(event.body);
        
        if (!order || !Array.isArray(order)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid order data' })
            };
        }

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        // Update order_index for each service (colonne unifiée)
        const updatePromises = order.map(item => 
            supabase
                .from('services')
                .update({ order_index: item.display_order })
                .eq('id', item.id)
        );

        await Promise.all(updatePromises);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: 'Order updated' })
        };

    } catch (error) {
        console.error('Reorder error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to update order', message: error.message })
        };
    }
};
