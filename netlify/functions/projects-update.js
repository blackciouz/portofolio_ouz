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
      .from('projects')
      .update({
        title: body.title,
        slug: body.slug,
        short_description: body.short_description,
        full_description: body.full_description,
        category: body.category,
        technologies: body.technologies,
        image_url: body.image_url,
        gallery_images: body.gallery_images,
        external_link: body.external_link,
        demo_url: body.demo_url,
        github_url: body.github_url,
        client_name: body.client_name,
        project_date: body.project_date,
        duration: body.duration,
        team_size: body.team_size,
        my_role: body.my_role,
        embedded_files: body.embedded_files,
        stats: body.stats,
        testimonial: body.testimonial,
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
    console.error('Error updating project:', error);
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
