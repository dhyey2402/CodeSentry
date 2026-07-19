import React, { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const TabsContext = createContext();

export const Tabs = ({ defaultValue, className, children, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("flex flex-col", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-surface p-1 text-text-muted border border-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, className, children, ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "text-text-primary" : "text-text-muted hover:text-text-secondary hover:bg-surface-hover/50",
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId="tabs-trigger-active"
          className="absolute inset-0 rounded-sm bg-background shadow-sm border border-border"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export const TabsContent = ({ value, className, children, ...props }) => {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
