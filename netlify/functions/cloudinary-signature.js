const crypto = require('crypto');

/**
 * Generate Cloudinary signature for secure uploads
 * This endpoint provides signed upload parameters to the client
 */
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
        const { folder = 'portfolio', public_id } = JSON.parse(event.body || '{}');

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!apiSecret || !apiKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Cloudinary not configured' })
            };
        }

        const timestamp = Math.round(Date.now() / 1000);

        // Build params to sign
        const params = {
            timestamp: timestamp,
            folder: folder
        };

        if (public_id) {
            params.public_id = public_id;
        }

        // Create signature string
        const paramsString = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');

        const signature = crypto
            .createHash('sha1')
            .update(paramsString + apiSecret)
            .digest('hex');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                signature: signature,
                timestamp: timestamp,
                cloudName: cloudName,
                apiKey: apiKey,
                folder: folder,
                uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
            })
        };

    } catch (error) {
        console.error('Signature generation error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to generate signature',
                message: error.message 
            })
        };
    }
};
