const crypto = require('crypto');

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
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
        const { file, folder = 'portfolio' } = JSON.parse(event.body);
        
        if (!file) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'No file provided' })
            };
        }

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!apiKey || !apiSecret) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Cloudinary credentials not configured' })
            };
        }

        // Generate timestamp
        const timestamp = Math.round(Date.now() / 1000);

        // Parameters to sign
        const params = {
            timestamp: timestamp,
            folder: folder,
            upload_preset: 'ml_default' // You can create a custom preset in Cloudinary
        };

        // Generate signature
        const paramsString = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        
        const signature = crypto
            .createHash('sha1')
            .update(paramsString + apiSecret)
            .digest('hex');

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('timestamp', timestamp);
        formData.append('folder', folder);
        formData.append('api_key', apiKey);
        formData.append('signature', signature);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        
        const response = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: 'Cloudinary upload failed', 
                    details: result 
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format
            })
        };

    } catch (error) {
        console.error('Upload error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error', 
                message: error.message 
            })
        };
    }
};
