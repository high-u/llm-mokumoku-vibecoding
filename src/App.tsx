import { useState, useEffect } from 'react';
import { addMemo, getMemos, deleteMemo } from './utils/indexedDB';

interface Memo {
  id?: number;
  text: string;
  timestamp: number;
}

function App() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemoText, setNewMemoText] = useState('');

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    const storedMemos = await getMemos();
    setMemos(storedMemos);
  };

  const handleAddMemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemoText.trim() === '') return;

    await addMemo(newMemoText);
    setNewMemoText('');
    loadMemos();
  };

  const handleDeleteMemo = async (id: number) => {
    await deleteMemo(id);
    loadMemos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg">ひと言メモ</h1>

      <form onSubmit={handleAddMemo} className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 mb-8 transform transition-all duration-300 hover:scale-105">
        <textarea
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg resize-none"
          rows={3}
          placeholder="今日のひと言を入力..."
          value={newMemoText}
          onChange={(e) => setNewMemoText(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-300 text-lg"
        >
          メモを追加
        </button>
      </form>

      <div className="w-full max-w-md">
        {memos.length === 0 ? (
          <p className="text-white text-center text-xl opacity-80">まだメモがありません。</p>
        ) : (
          <ul className="space-y-4">
            {memos.map((memo) => (
              <li
                key={memo.id}
                className="bg-white rounded-xl shadow-xl p-5 flex justify-between items-center transform transition-all duration-300 hover:scale-105 hover:shadow-purple-300/50"
              >
                <p className="text-gray-800 text-lg flex-grow pr-4 break-words">
                  {memo.text}
                  <span className="block text-sm text-gray-500 mt-1">
                    {new Date(memo.timestamp).toLocaleString()}
                  </span>
                </p>
                <button
                  onClick={() => handleDeleteMemo(memo.id!)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg shadow-md transition-colors duration-300 text-sm flex-shrink-0"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
