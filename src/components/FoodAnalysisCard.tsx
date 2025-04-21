import React from "react";
import { Sparkles, Flame, Salad, Lightbulb, Laugh } from "lucide-react";
import Image from "next/image";

interface Props {
  data: {
    foods?: string[];
    estimatedCalories?: number;
    health?: "Healthy" | "Moderate" | "Unhealthy";
    reason?: string;
    tip?: string;
    joke?: string;
  };
  image: string;
}

export default function FoodAnalysisCard({ data, image }: Props) {
  const showJokeOnly = !!data.joke;

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-5 shadow-xl border border-gray-700 space-y-4 transition hover:shadow-2xl">
      {/* Image preview */}
      <div className="rounded-xl overflow-hidden border border-gray-700 shadow-sm">
        <Image
          src={image}
          alt="Analyzed Food"
          width={400}
          height={250}
          className="object-cover w-full h-56 transition duration-300 hover:scale-105"
        />
      </div>

      {/* Joke Mode */}
      {showJokeOnly ? (
        <div className="text-md text-gray-200 text-[18px] text-center italic flex items-center justify-center gap-2">
          <Laugh className="w-20 h-20 self-start text-yellow-300" />
          <span>“{data.joke}”</span>
        </div>
      ) : (
        <div className="space-y-3 text-[15px] text-gray-200">
          <div className="flex items-center gap-2">
            <Salad className="w-4 h-4 text-green-300" />
            <span className="font-semibold text-gray-300">Foods:</span>
            <span className="text-gray-200">{data.foods?.join(", ")}</span>
          </div>

          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="font-semibold text-gray-300">Calories:</span>
            <span className="bg-orange-400/20 px-2 py-0.5 rounded-full text-orange-300 text-sm">
              {data.estimatedCalories} kcal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-gray-300">Health:</span>
            <span
              className={`px-2 py-0.5 rounded-full text-sm font-medium ${
                data.health === "Healthy"
                  ? "bg-green-500/20 text-green-400"
                  : data.health === "Moderate"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {data.health}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-300">Why:</span>{" "}
            <span className="text-gray-300">{data.reason}</span>
          </div>

          {data.tip && (
            <div className="flex gap-2 items-start">
              <Lightbulb className="w-4 h-4 text-yellow-200 mt-0.5" />
              <p>
                <span className="font-semibold text-gray-300">Tip:</span>{" "}
                {data.tip}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
