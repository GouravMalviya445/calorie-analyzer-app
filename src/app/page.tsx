"use client";
import FoodAnalysisCard from "@/components/FoodAnalysisCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFoodResponse, GeminiResponse } from "@/lib/genai";
import { Eye, EyeOff, UploadCloud } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

export default function Home() {
  const [imageFile, setImageFile] = useState<{ image: string; fileName: string }>({
    image: "",
    fileName: "",
  });
  const [selectedType, setSelectedType] = useState<"image" | "url">("image");
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse>();
  const [isPreview, setIsPreview] = useState(false);


  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);


  // handle file change
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result;
      setImageFile({ image: base64String as string, fileName: file.name });
    };
    reader.readAsDataURL(file);
  }


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imageFile.image) return;

    if (!imageFile.image.startsWith("http")) {
      return alert("Please provide a valid image URL.");
    }

    setIsLoading(true);
    try {
      const res = await getFoodResponse(imageFile.image);
      setGeminiResponse(res);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      setImageFile({ image: "", fileName: "" });
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4 py-10 text-white">
      <section className="max-w-5xl mx-auto space-y-10">
        {/* Title */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">🍱 Food Calorie Analyzer</h1>
          <p className="text-gray-400 max-w-lg mx-auto text-base">
            Upload your food image and let AI estimate calories and health score in seconds.
          </p>
        </div>

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-gray-700 transition-all shadow-xl flex flex-col items-center gap-6"
        >
          <select onChange={(e) => setSelectedType(e.target.value.toLowerCase() as "image" | "url")} autoFocus name="input" id="select" className="text-gray-400 border border-gray-600 p-1 px-3 rounded-md">
            <option disabled value="Select between Image and Url">Select between Image and Url</option>
            <option value="Image">Image</option>
            <option value="Url">Url</option>
          </select>


          {/* Upload Box */}
          {selectedType === "image" ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-md border-2 border-dashed border-gray-500 rounded-2xl p-6 cursor-pointer hover:border-blue-400 hover:bg-white/10 transition-all duration-200 text-center"
            >
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <UploadCloud className="mx-auto w-10 h-10 text-gray-400 mb-2" />
              <p className="text-gray-300 text-sm">
                {imageFile.fileName
                  ? `Selected: ${imageFile.fileName}`
                  : "Click to upload your food image"}
              </p>
            </div>
          ) : (
              <div
                className="max-w-md flex justify-between gap-3"
              >
                <Input
                  className="w-full"
                  type="text"
                  placeholder="Enter image url"
                  ref={urlInputRef}
                />

                {!isPreview ? (
                    <Button
                      size="icon" className="border border-gray-600"
                      type="button"
                      onClick={() => {
                        setImageFile({ image: urlInputRef.current?.value || "", fileName: "" })
                        setIsPreview(true)
                      }}
                    >
                      <Eye className="w-4 h-4"/>
                    </Button>
                  ) : (
                    <Button
                      size="icon" className="border border-gray-600"
                      type="button"
                      onClick={() => {
                        setIsPreview(false)
                        setImageFile({ image: "", fileName: "" })
                      }}
                    >
                      <EyeOff className="w-4 h-4"/>
                    </Button>
                  )
                }
              </div>
          )}

          {/* Preview */}
          {imageFile.image && (
            <div className="rounded-xl overflow-hidden border border-gray-600">
              <Image
                src={imageFile.image}
                alt="Preview"
                width={280}
                height={180}
                className="rounded-lg object-cover"
              />
            </div>
          )}

          {/* Button */}
          <Button
            type="submit"
            variant="secondary"
            className="w-full max-w-md"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze Food"}
          </Button>
        </form>

        {/* Output */}
        <div className="flex justify-center items-center">
          {isLoading && (
            <p className="text-center animate-pulse text-gray-400">Analyzing image...</p>
          )}
          {!isLoading && geminiResponse && (
            <FoodAnalysisCard data={geminiResponse.data} image={geminiResponse.image} />
          )}
        </div>
      </section>
    </main>
  );
}
