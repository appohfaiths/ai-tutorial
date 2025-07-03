import { NextResponse } from 'next/server';
import {inference} from "@/utils/huggingFace";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const prompt = formData.get('prompt');
        const max_length = formData.get('max_length') ? parseInt(formData.get('max_length')) : 200;
        const temperature = formData.get('temperature') ? parseFloat(formData.get('temperature')) : 0.7;
        console.log(prompt);

        if (!prompt) {
            return NextResponse.json({
                error: 'Missing prompt parameter',
            }, { status: 400 });
        }

        const out = await inference.textClassification({
            model: "appohfaiths/dummy-model",
            inputs: prompt,

        })

        console.log('Inference Output:', out);

        const classification = out;

        return NextResponse.json({
            prompt: prompt,
            classification,
            // You might want to include additional metadata
            metadata: {
                max_length,
                temperature,
                model: "appohfaiths/dummy-model"
            }
        });

    } catch (error) {
        console.error('Generation error:', error);
        return NextResponse.json({
            error: 'Failed to generate text',
            details: error.message
        }, { status: 500 });
    }
}