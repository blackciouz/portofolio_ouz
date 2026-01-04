const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    
    if (body.adminPassword !== process.env.ADMIN_PASSWORD) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Unauthorized' })
      };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('services')
      .update({
        title: body.title,
        slug: body.slug,
        short_description: body.short_description,
        full_description: body.full_description,
        icon: body.icon,
        category: body.category,
        price_starting_from: body.price_starting_from,
        external_link: body.external_link,
        features: body.features,
        technologies: body.technologies,
        image_url: body.image_url,
        gallery_images: body.gallery_images,
        is_featured: body.is_featured,
        order_index: body.order_index
      })
      .eq('id', body.id)
      .select();

    if (error) throw error;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: data[0]
      })
    };

  } catch (error) {
    console.error('Error updating service:', error);
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
