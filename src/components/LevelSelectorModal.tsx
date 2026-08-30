import React from 'react';
import { LevelType } from '../types';
import { LEVEL_DEFINITIONS } from '../data/initialData';
import { Check, X, ShieldAlert, Sparkles } from 'lucide-react';

interface LevelSelectorModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentLevel: LevelType;
  onSelectLevel: (level: LevelType) => void;
}

export const LevelSelectorModal: React.FC<LevelSelectorModalProps> = ({
  isOpen = true,
  onClose,
  currentLevel,
  onSelectLevel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100 font-arabic">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">اختر مستواك التعليمي</h2>
            <p className="text-xs text-slate-400">
              سيتم تخصيص تمارين الاستماع والتحدث والقراءة والكتابة لتناسب مستواك المختار.
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {LEVEL_DEFINITIONS.map((lvl) => {
            const isSelected = currentLevel === lvl.id;
            return (
              <div
                key={lvl.id}
                onClick={() => {
                  onSelectLevel(lvl.id);
                  onClose();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="text-3xl p-2 bg-slate-800 rounded-xl border border-slate-700 shrink-0">
                  {lvl.badge}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-base flex items-center gap-2">
                      {lvl.titleAr}
                      <span className="text-xs font-mono text-indigo-300 font-normal bg-indigo-900/60 px-2 py-0.5 rounded">
                        {lvl.cefr}
                      </span>
                    </h3>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/30">
                        <Check className="w-3.5 h-3.5" />
                        المستوى الحالي
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lvl.descriptionAr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-indigo-600/30"
          >
            حفظ واستمرار
          </button>
        </div>
      </div>
    </div>
  );
};
