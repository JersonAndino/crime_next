"use client"
import React, { useState } from "react";

const TabsL = () => {
  const [activeTab, setActiveTab] = useState(1); // Tab activa por defecto

  const renderContent = () => {
      switch (activeTab) {
          case 1:
              return <p>This is the content for Tab 1.</p>;
          case 2:
              return <p>This is the content for Tab 2.</p>;
          case 3:
              return <p>This is the content for Tab 3.</p>;
          default:
              return <p>Select a tab to see its content.</p>;
      }
  };

  return (
      <div>
          {/* Tab List */}
          <div role="tablist" className="tabs tabs-lifted">
              <button
                  role="tab"
                  aria-selected={activeTab === 1}
                  className={`tab ${activeTab === 1 ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(1)}
              >
                  Tab 1
              </button>
              <button
                  role="tab"
                  aria-selected={activeTab === 2}
                  className={`tab ${activeTab === 2 ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(2)}
              >
                  Tab 2
              </button>
              <button
                  role="tab"
                  aria-selected={activeTab === 3}
                  className={`tab ${activeTab === 3 ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(3)}
              >
                  Tab 3
              </button>
          </div>

          {/* Single Tab Panel */}
          <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
              {renderContent()}
          </div>
      </div>
  );
};

export default TabsL;
