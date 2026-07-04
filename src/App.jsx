import { useState } from 'react';
import { useLibrary } from './hooks/useLibrary.js';
import { useSettings } from './hooks/useSettings.js';
import LibraryScreen from './components/LibraryScreen.jsx';
import DetailScreen from './components/DetailScreen.jsx';
import AddScreen from './components/AddScreen.jsx';
import EditScreen from './components/EditScreen.jsx';
import SettingsScreen from './components/SettingsScreen.jsx';
import TabBar from './components/TabBar.jsx';

export default function App() {
  const { items, plusOne, minusOne, toggleFav, setStatus, addItem, editItem, deleteItem } = useLibrary();
  const { settings, setAccentKey, setCoverStyle, setDensity } = useSettings();
  const [screen, setScreen] = useState('library');
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const selected = items.find((m) => m.id === selectedId);

  function openDetail(id) {
    setSelectedId(id);
    setScreen('detail');
  }

  function openEdit(id) {
    setSelectedId(id);
    setScreen('edit');
  }

  function handleAdd(form) {
    addItem(form);
    setScreen('library');
    setFilter('all');
    setQuery('');
  }

  function handleSaveEdit(id, form) {
    editItem(id, form);
    setScreen('detail');
  }

  function handleDelete(id) {
    deleteItem(id);
    setSelectedId(null);
    setScreen('library');
  }

  return (
    <div className="app-shell">
      {screen === 'library' && (
        <LibraryScreen
          items={items}
          settings={settings}
          query={query}
          setQuery={setQuery}
          filter={filter}
          setFilter={setFilter}
          onOpen={openDetail}
          onPlusOne={plusOne}
          onToggleFav={toggleFav}
          onOpenSettings={() => setScreen('settings')}
        />
      )}

      {screen === 'detail' && selected && (
        <DetailScreen
          manga={selected}
          settings={settings}
          onBack={() => setScreen('library')}
          onPlusOne={plusOne}
          onMinusOne={minusOne}
          onToggleFav={toggleFav}
          onSetStatus={setStatus}
          onEdit={openEdit}
        />
      )}

      {screen === 'add' && (
        <AddScreen settings={settings} onBack={() => setScreen('library')} onAdd={handleAdd} />
      )}

      {screen === 'edit' && selected && (
        <EditScreen
          manga={selected}
          settings={settings}
          onBack={() => setScreen('detail')}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          settings={settings}
          onBack={() => setScreen('library')}
          onSetAccent={setAccentKey}
          onSetCoverStyle={setCoverStyle}
          onSetDensity={setDensity}
        />
      )}

      <TabBar screen={screen} onLibrary={() => setScreen('library')} onAdd={() => setScreen('add')} />
    </div>
  );
}
