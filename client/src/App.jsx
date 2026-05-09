import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";

export default function App() {
  const [uploadText, setUploadText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleUpload = async () => {
    if (!uploadText.trim()) return;
    setIsUploading(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: uploadText }),
      });
      const data = await response.json();
      setStatus({ type: "success", message: data.message || "Content uploaded successfully!" });
      setUploadText("");
    } catch (error) {
      setStatus({ type: "error", message: "Failed to upload content." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setIsAsking(true);
    setAnswer("");
    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Sorry, I couldn't process your question.");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 flex flex-col items-center">
      <header className="max-w-4xl w-full mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
          AI Knowledge Base
        </h1>
        <p className="text-gray-400 text-lg">Upload context and ask questions to your personal AI assistant.</p>
      </header>

      <main className="max-w-4xl w-full grid gap-8 grid-cols-1 md:grid-cols-2">
        {/* Upload Section */}
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle>Upload Context</CardTitle>
            <CardDescription>Paste text here to train your AI assistant on specific information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your text here (e.g., articles, notes, documentation)..."
              className="min-h-[200px] mb-4 bg-black/40"
              value={uploadText}
              onChange={(e) => setUploadText(e.target.value)}
            />
            {status.message && (
              <div className={`text-sm mb-4 p-2 rounded ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {status.message}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={handleUpload}
              disabled={isUploading || !uploadText.trim()}
            >
              {isUploading ? "Uploading..." : "Upload Content"}
            </Button>
          </CardFooter>
        </Card>

        {/* Ask Section */}
        <Card className="border-purple-500/20 bg-purple-500/5 flex flex-col">
          <CardHeader>
            <CardTitle>Ask Anything</CardTitle>
            <CardDescription>Ask questions based on the content you've uploaded above.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              <Input
                placeholder="Type your question..."
                className="bg-black/40"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              />
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleAsk}
                disabled={isAsking || !question.trim()}
              >
                {isAsking ? "Thinking..." : "Ask Question"}
              </Button>
              
              {answer && (
                <div className="mt-6 p-4 rounded-lg bg-black/40 border border-purple-500/20 animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-sm font-medium text-purple-400 mb-2">Assistant Response:</p>
                  <p className="text-gray-200 leading-relaxed">{answer}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="mt-16 text-gray-500 text-sm">
        Built with React, Tailwind, and Groq LLM
      </footer>
    </div>
  );
}
