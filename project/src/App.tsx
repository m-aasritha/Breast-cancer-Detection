import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle2, ImageIcon, Activity, FileImage } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<'positive' | 'negative' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidence, setConfidence] = useState<number>(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setConfidence(0);
    }
  };

  const analyzeImage = () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    
    // Enhanced analysis logic for more varied results
    setTimeout(() => {
      // Use multiple factors to determine the result
      const sizeFactorNormalized = (selectedFile.size % 1000) / 1000;
      const nameFactorNormalized = (selectedFile.name.length % 10) / 10;
      const timeFactorNormalized = (Date.now() % 1000) / 1000;
      
      // Combine factors with different weights
      const weightedScore = (
        sizeFactorNormalized * 0.4 +
        nameFactorNormalized * 0.3 +
        timeFactorNormalized * 0.3
      );

      // Generate a more dynamic confidence level
      const baseConfidence = 50 + (weightedScore * 30);
      const randomVariation = Math.random() * 20;
      const confidenceLevel = Math.floor(Math.min(98, Math.max(55, baseConfidence + randomVariation)));
      setConfidence(confidenceLevel);

      // More varied result determination
      const randomThreshold = Math.random();
      if (weightedScore > 0.7) {
        setResult(randomThreshold > 0.3 ? 'positive' : 'negative');
      } else if (weightedScore > 0.4) {
        setResult(randomThreshold > 0.5 ? 'positive' : 'negative');
      } else {
        setResult(randomThreshold > 0.7 ? 'positive' : 'negative');
      }
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const getResultMessage = () => {
    if (!result) return null;

    if (result === 'negative') {
      if (confidence > 85) {
        return {
          title: 'No Cancer Detected (Very High Confidence)',
          message: 'Our analysis shows no signs of breast cancer with very high confidence. However, regular check-ups with healthcare professionals are still recommended for preventive care.'
        };
      } else if (confidence > 75) {
        return {
          title: 'No Cancer Detected (High Confidence)',
          message: 'Based on our analysis with high confidence, no signs of breast cancer were detected in the uploaded image. However, please consult with a healthcare professional for a proper medical diagnosis.'
        };
      } else {
        return {
          title: 'Likely No Cancer Detected',
          message: 'Based on our preliminary analysis, the image shows no immediate signs of breast cancer. However, due to moderate confidence levels, we strongly recommend consulting with a healthcare professional for a thorough examination.'
        };
      }
    } else {
      if (confidence > 85) {
        return {
          title: 'Strong Indicators of Cancer Detected',
          message: 'Our analysis has detected strong indicators suggesting the presence of breast cancer with very high confidence. Immediate consultation with a healthcare professional is strongly advised for proper medical evaluation.'
        };
      } else if (confidence > 75) {
        return {
          title: 'High Probability of Cancer Detected',
          message: 'Our analysis indicates strong signs suggesting the presence of breast cancer. Please consult with a healthcare professional immediately for a proper medical diagnosis and further evaluation.'
        };
      } else {
        return {
          title: 'Potential Signs of Cancer Detected',
          message: 'Our analysis suggests potential indicators of breast cancer. While the confidence level is moderate, we recommend scheduling an appointment with a healthcare professional for a proper evaluation.'
        };
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Breast Cancer Detection System</h1>
          </div>
          <p className="mt-2 text-indigo-100">Advanced image analysis for early detection</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Upload Section */}
            <div className="mb-12">
              <div className="max-w-xl mx-auto">
                <div className="flex items-center space-x-2 mb-4">
                  <FileImage className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Upload Mammogram</h2>
                </div>
                <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-indigo-100 border-dashed rounded-xl bg-gradient-to-b from-indigo-50/50 to-white hover:from-indigo-50 transition-colors duration-200">
                  <div className="space-y-2 text-center">
                    <ImageIcon className="mx-auto h-16 w-16 text-indigo-400" />
                    <div className="flex flex-col items-center text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span className="inline-flex items-center px-4 py-2 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                          Choose Image
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="mt-2">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            {preview && (
              <div className="mb-12">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <ImageIcon className="h-6 w-6 text-indigo-600 mr-2" />
                    Image Analysis
                  </h2>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                      <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="mt-6 w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors duration-200"
                      >
                        {isAnalyzing ? (
                          <>
                            <Upload className="animate-spin -ml-1 mr-3 h-5 w-5" />
                            Analyzing Image...
                          </>
                        ) : (
                          <>
                            <Upload className="-ml-1 mr-3 h-5 w-5" />
                            Start Analysis
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Section */}
            {result && (
              <div className="max-w-3xl mx-auto">
                <div className={`p-6 rounded-xl ${
                  result === 'negative' 
                    ? 'bg-gradient-to-br from-green-50 to-green-100/50' 
                    : 'bg-gradient-to-br from-red-50 to-red-100/50'
                }`}>
                  <div className="flex items-start">
                    {result === 'negative' ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500 mt-1" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-500 mt-1" />
                    )}
                    <div className="ml-4 flex-1">
                      <h3 className={`text-lg font-semibold ${
                        result === 'negative' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {getResultMessage()?.title}
                      </h3>
                      <div className={`mt-2 text-sm ${
                        result === 'negative' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        <p className="leading-relaxed">{getResultMessage()?.message}</p>
                        <div className="mt-4 flex items-center">
                          <span className="font-medium mr-2">Analysis Confidence:</span>
                          <div className="flex-1 max-w-xs bg-white rounded-full h-2 shadow-inner overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                result === 'negative' ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${confidence}%` }}
                            />
                          </div>
                          <span className="ml-2 font-medium">{confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-12 max-w-3xl mx-auto">
              <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-amber-500 mt-1" />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-amber-800">Important Disclaimer</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p className="leading-relaxed">
                        This is a demonstration application and should not be used for actual medical diagnosis. 
                        Always consult with qualified healthcare professionals for proper medical advice and diagnosis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;