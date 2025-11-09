import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode, language, setLanguage }) {
  const languageVersionMap = {
    javascript: "18.15.0",
    python: "3.10.0",
    cpp: "10.2.0",
    java: "15.0.2",
  };

  // ✅ Keep the version derived from language
  const version = languageVersionMap[language];

  return (
    <div className="flex flex-col flex-1 bg-bg">
      <div className="flex justify-between items-center p-2 bg-surface border-b border-border">
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-border rounded p-1 bg-bg text-sm text-teal-50"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>
        <p className="text-xs text-muted">
          Version: <span className="text-primary font-semibold">{version}</span>
        </p>
      </div>
      <Editor
        height="60vh"
        theme="vs-dark"
        language={language}
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
