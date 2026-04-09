import { motion } from 'framer-motion';
import { Paintbrush, RectangleHorizontal, Puzzle, Eye, RotateCcw } from 'lucide-react';
import { useEditorStore } from '../../stores/editorStore';
import { Button } from '../ui/Button';

const categories = [
  { id: 'paint', label: 'Paint', icon: <Paintbrush size={16} /> },
  { id: 'plate', label: 'Plates', icon: <RectangleHorizontal size={16} /> },
  { id: 'accessories', label: 'Add-ons', icon: <Puzzle size={16} /> },
  { id: 'view', label: 'View', icon: <Eye size={16} /> },
];

const presetColors = [
  '#E53E3E', '#DD6B20', '#D69E2E', '#38A169', '#3182CE',
  '#5A67D8', '#805AD5', '#D53F8C', '#1A202C', '#F7FAFC',
  '#C0C0C0', '#FFD700',
];

function PaintSection() {
  const { modifications, setPaintColor, setMetalness, setRoughness } = useEditorStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">Color</label>
        <div className="grid grid-cols-6 gap-2">
          {presetColors.map((c) => (
            <button
              key={c}
              onClick={() => setPaintColor(c)}
              className={`w-8 h-8 rounded-lg cursor-pointer transition-all duration-200 border-2 hover:scale-110 ${
                modifications.paintColor === c ? 'border-[var(--accent)] scale-110 shadow-md' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="color"
            value={modifications.paintColor}
            onChange={(e) => setPaintColor(e.target.value)}
            className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
          />
          <span className="text-xs text-[var(--text-muted)] font-mono">
            {modifications.paintColor.toUpperCase()}
          </span>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">
          Metalness — {Math.round(modifications.metalness * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={modifications.metalness}
          onChange={(e) => setMetalness(parseFloat(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">
          Roughness — {Math.round(modifications.roughness * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={modifications.roughness}
          onChange={(e) => setRoughness(parseFloat(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
      </div>
    </div>
  );
}

function PlateSection() {
  const { modifications, setLicensePlateText, setLicensePlateColor, setLicensePlateBg } = useEditorStore();
  const { licensePlate } = modifications;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">
          Plate Text
        </label>
        <input
          type="text"
          value={licensePlate.text}
          onChange={(e) => setLicensePlateText(e.target.value.toUpperCase())}
          maxLength={10}
          className="w-full glass-subtle px-3 py-2 text-sm text-[var(--text-primary)] bg-transparent outline-none focus:border-[var(--accent)]"
          placeholder="ABC 1234"
        />
      </div>
      <div className="flex gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Text Color</label>
          <input
            type="color"
            value={licensePlate.color}
            onChange={(e) => setLicensePlateColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Background</label>
          <input
            type="color"
            value={licensePlate.backgroundColor}
            onChange={(e) => setLicensePlateBg(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
          />
        </div>
      </div>
      {/* Preview */}
      <div
        className="rounded-lg px-4 py-2 text-center font-bold text-lg tracking-widest border"
        style={{
          backgroundColor: licensePlate.backgroundColor,
          color: licensePlate.color,
          borderColor: licensePlate.color + '33',
        }}
      >
        {licensePlate.text || '—'}
      </div>
    </div>
  );
}

function AccessoriesSection() {
  const { modifications, toggleAccessory } = useEditorStore();
  const grouped = modifications.accessories.reduce(
    (acc, a) => {
      if (!acc[a.category]) acc[a.category] = [];
      acc[a.category].push(a);
      return acc;
    },
    {} as Record<string, typeof modifications.accessories>
  );

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
            {cat}
          </p>
          <div className="space-y-1.5">
            {items.map((acc) => (
              <button
                key={acc.id}
                onClick={() => toggleAccessory(acc.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)] text-sm cursor-pointer transition-all duration-200 ${
                  acc.enabled
                    ? 'bg-[var(--accent)] text-white shadow-md'
                    : 'glass-subtle text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{acc.name}</span>
                <span className="text-xs opacity-70">{acc.enabled ? 'ON' : 'OFF'}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ViewSection() {
  const { modifications, setWireframe } = useEditorStore();

  return (
    <div className="space-y-4">
      <button
        onClick={() => setWireframe(!modifications.wireframe)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)] text-sm cursor-pointer transition-all duration-200 ${
          modifications.wireframe
            ? 'bg-[var(--accent)] text-white shadow-md'
            : 'glass-subtle text-[var(--text-secondary)]'
        }`}
      >
        <span>Wireframe Mode</span>
        <span className="text-xs">{modifications.wireframe ? 'ON' : 'OFF'}</span>
      </button>
    </div>
  );
}

const sections: Record<string, React.FC> = {
  paint: PaintSection,
  plate: PlateSection,
  accessories: AccessoriesSection,
  view: ViewSection,
};

export function EditorPanel() {
  const { selectedCategory, setSelectedCategory, resetModifications } = useEditorStore();
  const SectionComponent = sections[selectedCategory] || PaintSection;

  return (
    <div className="glass w-full lg:w-80 flex flex-col overflow-hidden">
      {/* Category Tabs */}
      <div className="flex border-b border-[var(--border-subtle)]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium cursor-pointer transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SectionComponent />
        </motion.div>
      </div>

      {/* Reset */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <Button
          variant="ghost"
          size="sm"
          icon={<RotateCcw size={14} />}
          onClick={resetModifications}
          className="w-full"
        >
          Reset All
        </Button>
      </div>
    </div>
  );
}
