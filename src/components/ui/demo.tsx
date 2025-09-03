import { PromptBox } from "@/components/ui/chatgpt-prompt-input";

export function PromptBoxDemo() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message");
    // In a real app, you would also handle the uploaded file here.
    if (!message && !event.currentTarget.querySelector('img')) {
      return;
    }
    alert(`Message Submitted!`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl flex flex-col gap-10">
          <p className="text-center text-3xl text-gray-900">
            Comment puis-je vous aider ?
          </p>
          <form onSubmit={handleSubmit}>
            <PromptBox name="message" />
          </form>
      </div>
    </div>
  );
}