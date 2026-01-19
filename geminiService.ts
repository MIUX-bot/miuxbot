import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResponse, GenerationOptions, UGCConcept } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Reusable schema definition for a single concept structure
const conceptProperties = {
  title: {
    type: Type.STRING,
    description: "A catchy title for this creative direction",
  },
  strategy: {
    type: Type.STRING,
    description: "Short explanation of why this angle works.",
  },
  scenes: {
    type: Type.ARRAY,
    description: "A sequence of scenes forming the storyline.",
    items: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "Scene label, e.g., 'Scene 1: The Hook'",
        },
        description: {
          type: Type.STRING,
          description: "Brief visual description of the action in this scene.",
        },
        textOverlay: {
          type: Type.STRING,
          description: "Short, punchy text to display on screen (TikTok style). In Indonesian.",
        },
        narration: {
          type: Type.STRING,
          description: "Voiceover script for this specific scene. In Indonesian.",
        },
        imageEditPrompt: {
          type: Type.STRING,
          description: "Prompt for AI Image Editor to create the base frame for THIS specific scene.",
        },
        videoGenPrompt: {
          type: Type.STRING,
          description: "Prompt for AI Video Generator to animate THIS specific scene (5-7 seconds).",
        },
      },
      required: ["title", "description", "textOverlay", "narration", "imageEditPrompt", "videoGenPrompt"],
    },
  },
};

const fullResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    concepts: {
      type: Type.ARRAY,
      description: "List of UGC creative concepts based on the product",
      items: {
        type: Type.OBJECT,
        properties: conceptProperties,
        required: ["title", "strategy", "scenes"],
      },
    },
  },
};

// Schema for generating just ONE concept
const singleConceptSchema: Schema = {
  type: Type.OBJECT,
  properties: conceptProperties,
  required: ["title", "strategy", "scenes"],
};

// Helper function to apply generation modes (Manual/Merged/None)
const processConcept = (concept: UGCConcept, options: GenerationOptions): UGCConcept => {
  const processedScenes = concept.scenes.map(scene => {
    const newScene = { ...scene }; // Clone to avoid mutation issues
    const additions: string[] = [];
    
    // Handle Text Overlay
    if (options.textOverlayMode === 'merged') {
      if (newScene.textOverlay) {
        additions.push(`Text Overlay to display: "${newScene.textOverlay}"`);
      }
    } else if (options.textOverlayMode === 'none') {
      newScene.textOverlay = '';
    }

    // Handle Narration
    if (options.narrationMode === 'merged') {
      if (newScene.narration) {
        additions.push(`Audio/Narration context: "${newScene.narration}"`);
      }
    } else if (options.narrationMode === 'none') {
      newScene.narration = '';
    }

    // Apply merges to video prompt
    if (additions.length > 0) {
      newScene.videoGenPrompt += ` -- ${additions.join(" -- ")}`;
    }
    
    return newScene;
  });

  return { ...concept, scenes: processedScenes };
};

const getStructureInstruction = (count: number) => {
    if (count === 1) return "Struktur: Hanya 1 Scene yang sangat kuat dan mencakup Hook + Product + CTA sekaligus.";
    if (count === 2) return "Struktur: Scene 1 (Hook/Masalah), Scene 2 (Solusi/CTA).";
    if (count === 3) return "Struktur: Scene 1 (Hook), Scene 2 (Body/Benefit), Scene 3 (CTA/Climax).";
    return `Struktur: Buat alur cerita logis dengan ${count} scene, dimulai dari Hook yang kuat, penjelasan bertahap, dan diakhiri CTA.`;
}

export const generateUGCPrompts = async (base64Image: string, mimeType: string, options: GenerationOptions): Promise<AnalysisResponse> => {
  try {
    const structureInstruction = getStructureInstruction(options.sceneCount);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `Anda adalah Creative Director ahli untuk konten TikTok/Reels.
            
            Tugas:
            1. Analisis gambar produk.
            2. Buat 3 KONSEP video berbeda (misal: Aesthetic, Problem-Solution, ASMR/Sensory).
            3. Pecah setiap konsep menjadi TEPAT ${options.sceneCount} SCENE BERURUTAN.
            
            ${structureInstruction}

            Untuk SETIAP Scene, berikan:
            1. **Teks Overlay**: Tulisan singkat di layar (Bahasa Indonesia, gaya bahasa santai/viral).
            2. **Narasi (VO)**: Skrip dubbing pendek yang pas dengan durasi (Bahasa Indonesia).
            3. **Prompt Image & Video**: Instruksi teknis untuk AI (Bahasa Inggris).

            Pastikan prompt antar scene memiliki konsistensi visual (lighting/style).`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: fullResponseSchema,
        systemInstruction: "You are an expert video strategist. You provide full production details including scripts and on-screen text.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text) as AnalysisResponse;

    // Apply post-processing
    data.concepts = data.concepts.map(c => processConcept(c, options));

    return data;
  } catch (error) {
    console.error("Error generating UGC prompts:", error);
    throw error;
  }
};

export const regenerateSingleConcept = async (base64Image: string, mimeType: string, options: GenerationOptions): Promise<UGCConcept> => {
  try {
    const structureInstruction = getStructureInstruction(options.sceneCount);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `Create ONE unique, fresh UGC video concept for this product. 
            Make it distinct and engaging.
            
            Generate EXACTLY ${options.sceneCount} Scenes.
            ${structureInstruction}
            
            Include: Title, Strategy, Scenes (with Text Overlay, VO, Image Prompt, Video Prompt).
            Language: Indonesian for Text/VO, English for Prompts.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: singleConceptSchema,
        systemInstruction: "You are an expert video strategist. Generate a single, high-quality video concept.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const concept = JSON.parse(text) as UGCConcept;
    return processConcept(concept, options);

  } catch (error) {
    console.error("Error regenerating single concept:", error);
    throw error;
  }
};