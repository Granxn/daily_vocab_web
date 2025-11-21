'use client';

import { useState } from 'react';

export default function Home() {
  // --- ส่วนที่ 1: ตัวแปรเก็บค่า (State) ---
  const [sentence, setSentence] = useState('');
  const [result, setResult] = useState<any>(null); // เก็บผลคะแนนที่ได้จาก API
  const [isLoading, setIsLoading] = useState(false);

  // ข้อมูลคำศัพท์จำลอง (จริงๆ ต้องดึงจาก API /random-word)
  const currentWord = { id: 1, word: 'apple', level: 'Beginner' };

  // --- ส่วนที่ 2: ฟังก์ชันทำงาน ---
  
  // ฟังก์ชันรับค่าตอนพิมพ์ (ตามโจทย์ 2.1)
  const handleSentenceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSentence(e.target.value);
  };

  // ฟังก์ชันส่งข้อมูลไปตรวจ (ตามโจทย์ 2.2)
  const handleSubmit = async () => {
    if (!sentence.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/validate-sentence', {
    method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word_id: currentWord.id,
          sentence: sentence,
        }),
      });

      if (!response.ok) throw new Error('Failed to validate');

      const data = await response.json();
      setResult(data); // เอาผลลัพธ์มาเก็บไว้โชว์

    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ API (อย่าลืมเปิด Backend นะ!)');
    } finally {
      setIsLoading(false);
    }
  };

  // --- ส่วนที่ 3: ส่วนแสดงผลหน้าเว็บ (JSX/HTML) ---
  // (ส่วนที่คุณน่าจะทำหายไป)
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Vocabulary Practice
        </h1>

        {/* โจทย์ */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-center">
          <p className="text-gray-600 mb-2">Please write a sentence using the word:</p>
          <h2 className="text-4xl font-extrabold text-blue-800 mb-2">{currentWord.word}</h2>
          <span className="inline-block px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
            Level: {currentWord.level}
          </span>
        </div>

        {/* กล่องพิมพ์ข้อความ */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Your Sentence:</label>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
            rows={4}
            placeholder="Type your sentence here..."
            value={sentence}
            onChange={handleSentenceChange}
          />
        </div>

        {/* ปุ่มกดส่ง */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !sentence}
          className={`w-full py-3 rounded-lg text-white font-bold text-lg transition-colors ${
            isLoading || !sentence
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isLoading ? 'Checking...' : 'Submit Answer'}
        </button>

        {/* ส่วนแสดงคะแนน (จะโชว์เมื่อมีผลลัพธ์แล้ว) */}
        {result && (
          <div className="mt-8 animate-fade-in">
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Result</h3>
              
              <div className={`p-6 rounded-lg border ${result.score >= 50 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-gray-700">Score</span>
                  <span className={`text-3xl font-bold ${result.score >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.score}/100
                  </span>
                </div>
                
                <div className="mb-2">
                  <span className="font-bold text-gray-700">Feedback:</span>
                  <p className="text-gray-600 mt-1">{result.suggestion}</p>
                </div>

                {result.corrected_sentence && (
                  <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                    <span className="font-bold text-green-700 block mb-1">Corrected Version:</span>
                    <p className="text-gray-800">{result.corrected_sentence}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}