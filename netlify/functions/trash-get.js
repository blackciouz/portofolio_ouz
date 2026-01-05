const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        const { data, error } = await supabase
            .from('deleted_items')
            .select('*')
            .order('deleted_at', { ascending: false });

        if (error) throw error;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ deletedItems: data || [] })
        };

    } catch (error) {
        console.error('Fetch deleted items error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to fetch deleted items', message: error.message })
        };
    }
};
