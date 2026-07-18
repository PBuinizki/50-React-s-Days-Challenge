import { useState, useRef, useId } from 'react';
import styles from './Tabs.module.css';

/**
 * @typedef {Object} TabItem
 * @property {string} id - Unique identifier for the tab.
 * @property {string} label - Visible tab label.
 * @property {React.ReactNode} content - Panel content rendered when tab is active.
 */

/**
 * @typedef {Object} TabsProps
 * @property {TabItem[]} tabs - Array of tab definitions.
 * @property {string} [defaultActiveId] - Initially active tab id. Defaults to first tab.
 * @property {(id: string) => void} [onChange] - Callback fired when active tab changes.
 */

/**
 * Accessible tabs component following WAI-ARIA Authoring Practices.
 * Supports keyboard navigation (Arrow keys, Home, End) and screen readers.
 *
 * @param {TabsProps} props
 * @returns {JSX.Element}
 *
 * @example
 * <Tabs tabs={[
 *   { id: 'one', label: 'First', content: <p>First panel</p> },
 *   { id: 'two', label: 'Second', content: <p>Second panel</p> },
 * ]} />
 */
const Tabs = ({ tabs, defaultActiveId, onChange }) => {
  // useId generates stable unique prefix for tab/panel ids.
  // Prevents collisions when multiple Tabs instances exist on the page.
  const instanceId = useId();

  const [activeId, setActiveId] = useState(defaultActiveId ?? tabs[0]?.id);

  // Ref to the tablist container — needed for keyboard navigation.
  const tabListRef = useRef(null);

  const handleTabClick = (id) => {
    setActiveId(id);
    onChange?.(id);
  };

  // Keyboard navigation per WAI-ARIA Tabs pattern:
  // Arrow Left/Right — move focus and activate tab (automatic activation).
  // Home/End — jump to first/last tab.
  const handleKeyDown = (e) => {
    const enabledTabs = tabs.filter((tab) => !tab.disabled);
    const currentIndex = enabledTabs.findIndex((tab) => tab.id === activeId);

    let nextIndex;
    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % enabledTabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = enabledTabs.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const nextTab = enabledTabs[nextIndex];
    handleTabClick(nextTab.id);

    // Move focus to the newly activated tab button.
    const tabButtons = tabListRef.current?.querySelectorAll('[role="tab"]');
    tabButtons?.[nextIndex]?.focus();
  };

  return (
    <div className={styles.tabs}>
      {/* role="tablist" marks the container as a list of tabs.
          aria-orientation="horizontal" tells screen readers the layout. */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-orientation="horizontal"
        className={styles.tabList}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          // Unique ids link tab to panel via aria-controls / aria-labelledby.
          const tabId = `${instanceId}-tab-${tab.id}`;
          const panelId = `${instanceId}-panel-${tab.id}`;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Only the active panel is rendered — avoids mounting hidden DOM.
          aria-labelledby links panel back to its tab for screen readers. */}
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        const tabId = `${instanceId}-tab-${tab.id}`;
        const panelId = `${instanceId}-panel-${tab.id}`;

        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId}
            tabIndex={0}
            className={styles.panel}
            hidden={!isActive}
          >
            {tab.content}
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;