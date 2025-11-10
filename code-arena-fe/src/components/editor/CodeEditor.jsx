import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode, language, setLanguage, starterCode = [] }) {
  const [version, setVersion] = useState("-");
  
  // ✅ Default language as "java" if not already set
   useEffect(() => {
    if (!language) {
      setLanguage("java");
    }
  }, [language, setLanguage]);

  // 🧠 Find the matching starter code object for the selected language
  const currentStarter = starterCode.find(
    (s) => s.language.toLowerCase() === (language || "java").toLowerCase()
  );

  // ⚙️ Update editor version and code whenever the language changes
  useEffect(() => {
    if (currentStarter) {
      console.log(currentStarter);
      setVersion(currentStarter.version || "-");
      setCode(currentStarter.codeTemplate || ""); // ✅ Always update to that language’s starter code
    } else {
      setVersion("-");
      setCode(""); // Clear editor if no starter code exists
    }
  }, [language, starterCode]);


  return (
    <div className="flex flex-col flex-1 bg-bg">
      {/* === Header Section === */}
      <div className="flex justify-between items-center p-2 bg-surface border-b border-border">
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted">Language:</label>
          <select
            value={language || "java"}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-border rounded p-1 bg-bg text-sm text-teal-50"
          >
            {starterCode.map((s) => (
              <option key={s.language} value={s.language.toLowerCase()}>
                {s.language}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-muted">
          Version:{" "}
          <span className="text-primary font-semibold">
            {version || "-"}
          </span>
        </p>
      </div>

      {/* === Monaco Code Editor === */}
      <Editor
        height="60vh"
        theme="vs-dark"
        language={language || "java"}
        value={code}
        onChange={(val) => setCode(val)}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          wordBasedSuggestions: true,
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true,
          },
        }}
      />
    </div>
  );
}
