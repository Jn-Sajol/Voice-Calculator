// import React, { useState } from 'react';

// interface Item {
//   quantity: number;
//   name: string;
//   price: number;
//   total: number;
// }

// const VoiceOrderApp: React.FC = () => {
//   const [items, setItems] = useState<Item[]>([]);
//   const [transcript, setTranscript] = useState('');
//   const [error, setError] = useState('');

//   const parseBanglaOrder = (input: string): Item | null => {
//     const quantityMatch = input.match(/([০-৯]+|\d+)টি/);
//     const priceMatch = input.match(/(\d+|[০-৯]+) ?টাকা/);
//     const nameMatch = input.match(/টি (.*?) (\d+|[০-৯]+) ?টাকা/);

//     if (!quantityMatch || !priceMatch || !nameMatch) {
//       return null;
//     }

//     const convertBanglaToNumber = (text: string): number => {
//       const banglaNumbers: Record<string, string> = {
//         '০': '0',
//         '১': '1',
//         '২': '2',
//         '৩': '3',
//         '৪': '4',
//         '৫': '5',
//         '৬': '6',
//         '৭': '7',
//         '৮': '8',
//         '৯': '9',
//       };
//       return parseInt(text.replace(/[০-৯]/g, (d) => banglaNumbers[d] || d));
//     };

//     const quantityText = quantityMatch[1];
//     const priceText = priceMatch[1];
//     const nameText = nameMatch[1];

//     const quantity = convertBanglaToNumber(quantityText);
//     const price = convertBanglaToNumber(priceText);
//     const total = quantity * price;

//     return { quantity, name: nameText, price, total };
//   };

//   const startListening = () => {
//     const SpeechRecognition =
//       (window as any).webkitSpeechRecognition ||
//       (window as any).SpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Speech recognition not supported.');
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = 'bn-BD';
//     recognition.interimResults = false;

//     recognition.onresult = (event: SpeechRecognitionEvent) => {
//       const spoken = event.results[0][0].transcript;
//       setTranscript(spoken);
//       const parsed = parseBanglaOrder(spoken);

//       if (parsed) {
//         setItems((prev) => [...prev, parsed]);
//         setError('');
//       } else {
//         setError('🔍 তথ্য বিশ্লেষণ করা যায়নি।');
//       }
//     };

//     recognition.onerror = () => setError('🎤 ভয়েস ইনপুটে সমস্যা হয়েছে।');

//     recognition.start();
//   };

//   const calculateTotal = () => {
//     return items.reduce((sum, item) => sum + item.total, 0);
//   };

//   return (
//     <div style={{ padding: 20, textAlign: 'center' }}>
//       <h1>🛍️ বাংলা ভয়েস অর্ডার</h1>
//       <button
//         onClick={startListening}
//         style={{ padding: '10px 20px', fontSize: 16 }}
//       >
//         🎙️ অর্ডার বলুন
//       </button>
//       <p>
//         🗣️ বললেন: <strong>{transcript}</strong>
//       </p>
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {items.length > 0 && (
//         <table style={{ margin: '20px auto', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               <th>পরিমাণ</th>
//               <th>পণ্যের নাম</th>
//               <th>দাম</th>
//               <th>মোট</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((item, index) => (
//               <tr key={index}>
//                 <td>{item.quantity}</td>
//                 <td>{item.name}</td>
//                 <td>{item.price} টাকা</td>
//                 <td>{item.total} টাকা</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {items.length > 0 && <h2>সর্বমোট: {calculateTotal()} টাকা</h2>}
//     </div>
//   );
// };

// export default VoiceOrderApp;

import React, { useState } from 'react';
import { create, all } from 'mathjs';

// Configure math.js to avoid BigInt/BigNumber issues
const config = {
  number: 'number',
  precision: 14,
};
const math = create(all, config);

const VoiceCalculator: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [result, setResult] = useState<string | number>('');

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: Event) => {
      const speechEvent = event as SpeechRecognitionEvent;
      const speechToText = speechEvent.results[0][0].transcript;
      setTranscript(speechToText);

      const expression = speechToText
        .toLowerCase()
        .replace(/plus/gi, '+')
        .replace(/minus/gi, '-')
        .replace(/times|into/gi, '*')
        .replace(/divided by/gi, '/');

      try {
        const result = math.evaluate(expression);
        setResult(result);
      } catch (error) {
        setResult('Error');
        console.error('Invalid expression:', error);
      }
    };

    recognition.onerror = (event: Event) => {
      const errorEvent = event as any;
      console.error('Speech recognition error', errorEvent.error);
    };

    recognition.start();
  };

  return (
    <div style={styles.container}>
      <h1>🎙️ Voice Calculator</h1>
      <button style={styles.button} onClick={startListening}>
        Start Speaking
      </button>
      <p>
        🗣️ Spoken: <strong>{transcript}</strong>
      </p>
      <h2>🧮 Result: {result}</h2>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    paddingTop: '50px',
    fontFamily: 'Arial, sans-serif',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '8px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
  },
};

export default VoiceCalculator;
