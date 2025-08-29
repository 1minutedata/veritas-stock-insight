import { useEffect } from "react";
import LangflowChat from "@/components/LangflowChat";

const Assistant = () => {
  useEffect(() => {
    document.title = "Veritasier - Your Assistant";
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <LangflowChat />
    </div>
  );
};

export default Assistant;
