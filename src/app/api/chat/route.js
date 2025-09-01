import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const prompt = formData.get('prompt');

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Make request to local Ollama instance
        const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3.1:8b',
                prompt: prompt,
                stream: false
            }),
        });

        if (!ollamaResponse.ok) {
            const errorText = await ollamaResponse.text();
            throw new Error(`Ollama API error: ${ollamaResponse.status} - ${errorText}`);
        }

        const data = await ollamaResponse.json();
        
        return NextResponse.json({ 
            response: data.response,
            model: data.model,
            done: data.done
        });

    } catch (error) {
        console.error('API Error:', error);
        let errorMessage = error.message;
        if (error.message.includes('ECONNREFUSED')) {
            errorMessage = 'Ollama server is not running. Please start it with: ollama serve';
        } else if (error.message.includes('404')) {
            errorMessage = 'Model not found. Available model: llama3.1:8b';
        }
        
        return NextResponse.json({ 
            error: errorMessage || 'Failed to process request' 
        }, { status: 500 });
    }
}