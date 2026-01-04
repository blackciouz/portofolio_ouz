const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    // Get query parameters
    const params = event.queryStringParameters || {};
    const slug = params.slug;
    const featured = params.featured === 'true';

    let query = supabase.from('services').select('*');

    // Filter by slug if provided
    if (slug) {
      query = query.eq('slug', slug).single();
    } else {
      // Filter by featured if requested
      if (featured) {
        query = query.eq('is_featured', true);
      }
      // Order by order_index and created_at
      query = query.order('order_index', { ascending: true })
                   .order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: data
      })
    };

  } catch (error) {
    console.error('Error fetching services:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
