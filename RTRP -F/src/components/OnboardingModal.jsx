import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Rocket, MapPin, User, ChevronRight, Check } from 'lucide-react';

export default function OnboardingModal() {
    const { currentUser, updateProfile } = useApp();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        role: '',
        location: '',
        bio: '',
        avatar: currentUser?.avatar || ''
    });

    // Avatar logic duplicated for simplicity or could be extracted, 
    // but here we might just want to let them pick a Style category for their auto-generated avatar.
    const [selectedCategory, setSelectedCategory] = useState('General');

    // Reuse the logic from Profile.jsx for categories
    const categoryStyles = {
        'General': { style: 'micah', color: 'e5e7eb' },
        'Programming': { style: 'bottts', color: 'bae6fd' },
        'Music': { style: 'avataaars', color: 'fbcfe8' },
        'Design': { style: 'notionists', color: 'e9d5ff' },
        'Academic': { style: 'miniavs', color: 'fde68a' },
        'Language': { style: 'open-peeps', color: 'bbf7d0' },
    };

    if (!currentUser) return null;

    // Check if user is already "complete" (has role and bio)
    // If they have them, don't show this modal.
    if (currentUser.role && currentUser.bio) return null;

    const generateAvatar = (cat) => {
        const { style, color } = categoryStyles[cat];
        const seed = Math.random().toString(36).substring(7);
        return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${color}`;
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleFinish = async () => {
        if (!formData.role || !formData.bio) return;

        // If avatar wasn't explicitly changed, maybe update it based on role/category?
        // Let's just save what we have.
        let finalData = { ...formData };
        if (!finalData.avatar || finalData.avatar === currentUser.avatar) {
            // If they didn't touch avatar but selected a category, generate one?
            // Optional: let's enforce generating one if they are on step 3
            finalData.avatar = generateAvatar(selectedCategory);
        }

        await updateProfile(finalData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f0c18]/90 backdrop-blur-md animate-in fade-in duration-500">
            <div className="w-full max-w-lg bg-[#13111C] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-1 bg-white/10 w-full">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                </div>

                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                            <Rocket className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome to SkillSwap!</h2>
                        <p className="text-gray-400">Let's set up your profile to get you started.</p>
                    </div>

                    {/* Step 1: Role & Location */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">What's your primary role?</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all"
                                        placeholder="e.g. Student, Guitarist, Web Developer"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Where are you based?</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all"
                                        placeholder="e.g. New York, Remote"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Bio */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tell us about yourself</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-all resize-none"
                                    placeholder="I love teaching music and want to learn coding..."
                                    autoFocus
                                />
                                <p className="text-right text-xs text-gray-500 mt-2">{formData.bio.length}/200</p>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Avatar Style */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300 text-center">
                            <label className="block text-sm font-medium text-gray-300">Choose your Avatar Style</label>

                            <div className="grid grid-cols-2 gap-3">
                                {Object.keys(categoryStyles).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`p-3 rounded-xl border transition-all text-sm font-medium ${selectedCategory === cat
                                                ? 'bg-purple-500/20 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                                                : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-center pt-4">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500 shadow-2xl shadow-purple-500/20 bg-gray-800">
                                    <img
                                        src={generateAvatar(selectedCategory)} // Preview based on category (random seed each render for vitality or fix it?)
                                        // To avoid flickering, normally we'd save the seed. For now let's use the category name as seed for stability in preview?
                                        // No, let's allow it to be random but maybe stable per category selection?
                                        // Let's just accept random preview for "vibe" checking.
                                        alt="Avatar Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">We'll generate a unique {selectedCategory} avatar for you.</p>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end gap-3">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-3 rounded-xl text-gray-400 hover:text-white font-medium transition-colors"
                        >
                            Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            disabled={(step === 1 && !formData.role) || (step === 2 && !formData.bio)}
                            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleFinish}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
                        >
                            Get Started <Check className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
