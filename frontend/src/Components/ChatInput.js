const ChatInput = ({ question, setQuestion, handleAskQuestion }) => (
    //It takes the input of the Question
    <div className="flex items-center p-2 w-full mt-2">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        className="flex-grow p-2 border rounded"
      />
      {/*Click ask to generate answer */}
      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 ml-2 rounded" onClick={handleAskQuestion}>
        Ask
      </button>
    </div>
  );
  export default ChatInput;
  