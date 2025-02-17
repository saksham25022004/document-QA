import React from "react";

const ChatHistory = ({ qaHistory, loading, chatBoxRef }) => {
  return (
    //It display all the previous chat
    <div className="p-4 h-[558px] overflow-auto" ref={chatBoxRef}>
      {qaHistory.length === 0 ? (
        //if the history is null print no history
        <div className="text-center text-gray-500">No History!</div>
      ) : (
        //if the history is present it will render
        qaHistory.map((qa, index) => (
          <div key={index} className="mb-2 border-b-2 last:border-b-0">
            <div className="text-white font-semibold bg-purple-400 p-2 rounded-lg max-w-[75%] w-auto min-w-[25%] mb-2">
              {qa.question}
            </div>

            <div className="text-gray-500 font-semibold bg-[#E6E6FA] p-2 rounded-lg max-w-[75%] w-auto min-w-[25%] mb-2 ml-auto flex justify-end">
              {qa.answer}
            </div>
          </div>
        ))
      )}
      {/*if the new question is asked while getting answer it will display generating answer...*/}
      {loading && <div className="text-gray-500 flex items-center justify-center m-3 text-lg">Generating answer...</div>}
    </div>
  );
};
export default ChatHistory;