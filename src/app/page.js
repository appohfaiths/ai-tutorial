 'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function Home() {
    const [result, setResult] = useState(null);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatClassification = (classification) => {
        return classification.map(result => ({
            sentiment: result.label, // Use the label that's already there
            score: result.score,
            originalLabel: result.label
        }));
    };

    const classify = async (text) => {
        if (!text) {
            setResult(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('prompt', text);

            const response = await fetch('/api/chat', {
                method: 'POST',
                body: formData,
            });

            console.log(response);

            const data = await response.json();

            console.log(data)

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze text');
            }

            if (data.classification) {
                const classification = formatClassification(data.classification);
                setResult(classification);
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInputText(text);

        // Debounce the API call
        const timeoutId = setTimeout(() => {
            classify(text);
        }, 1000);

        return () => clearTimeout(timeoutId);
    };

    const getSentimentColor = (sentiment) => {
        return sentiment === 'positive' ? 'bg-green-500' : 'bg-red-500';
    };

    return (
        <div className="min-h-screen p-4 bg-gray-50 flex items-center w-full">
            <div className="w-full max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Sentiment Analysis</CardTitle>
                        <CardDescription>
                            Enter some text to analyze its sentiment
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Type something..."
                                    value={inputText}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>

                            {isLoading && (
                                <div className="text-sm text-gray-500">
                                    Analyzing sentiment...
                                </div>
                            )}

                            {error && (
                                <div className="text-sm text-red-500">
                                    {error}
                                </div>
                            )}

                            {result && !isLoading && (
                                <div className="space-y-4">
                                    {result.map((item, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    className={`${getSentimentColor(item.sentiment)} text-white`}
                                                >
                                                    {item.sentiment?.toUpperCase()}
                                                </Badge>
                                                <span className="text-sm text-gray-500">
                                                    {(item.score * 100).toFixed(1)}% confidence
                                                </span>
                                            </div>
                                            <Progress
                                                value={item.score * 100}
                                                className={`h-2 ${getSentimentColor(item.sentiment)}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}