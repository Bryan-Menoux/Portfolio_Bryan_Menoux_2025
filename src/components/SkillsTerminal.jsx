import React, { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  Folder,
  Code,
  Settings,
  X,
  MousePointer2,
} from "lucide-react";
import { getCompetencesByCategory } from "../lib/pocketbase.mjs";

const SkillsTerminal = () => {
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [history, setHistory] = useState([""]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  const categoryNames = {
    frontend: "Frontend",
    backend: "Backend",
    outils: "Outils",
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setSelectedSuggestion(-1);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const commands = [
      "frontend",
      "backend",
      "outils",
      "clear",
      "exit",
      "cd ..",
    ];
    const filtered = commands.filter((cmd) =>
      cmd.toLowerCase().startsWith(value.trim().toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const commands = [
        "frontend",
        "backend",
        "outils",
        "clear",
        "exit",
        "cd ..",
      ];

      if (suggestions.length > 0) {
        let nextIndex = selectedSuggestion + 1;
        if (nextIndex >= suggestions.length) {
          nextIndex = 0;
        }
        setSelectedSuggestion(nextIndex);
        setInput(suggestions[nextIndex]);
      } else {
        const filtered = commands.filter((cmd) =>
          cmd.toLowerCase().startsWith(input.trim().toLowerCase())
        );
        if (filtered.length > 0) {
          setSuggestions(filtered);
          setSelectedSuggestion(0);
          setInput(filtered[0]);
        }
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        let nextIndex = selectedSuggestion + 1;
        if (nextIndex >= suggestions.length) {
          nextIndex = 0;
        }
        setSelectedSuggestion(nextIndex);
        setInput(suggestions[nextIndex]);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        let prevIndex = selectedSuggestion - 1;
        if (prevIndex < 0) {
          prevIndex = suggestions.length - 1;
        }
        setSelectedSuggestion(prevIndex);
        setInput(suggestions[prevIndex]);
      }
      return;
    }

    if (e.key === "Enter") {
      const command = input.trim().toLowerCase();

      if (Object.keys(skills).includes(command)) {
        setSelectedCategory(command);
        setHistory([...history, input]);
        setInput("");
        setSuggestions([]);
        setSelectedSuggestion(-1);
      } else if (command === "clear" || command === "cls") {
        setHistory([""]);
        setInput("");
        setSelectedCategory(null);
        setSuggestions([]);
        setSelectedSuggestion(-1);
      } else if (
        command === "exit" ||
        command === "cd .." ||
        command === ".."
      ) {
        setSelectedCategory(null);
        setInput("");
        setSuggestions([]);
        setSelectedSuggestion(-1);
      } else if (command !== "") {
        setHistory([
          ...history,
          input,
          "Commande non reconnue. Tapez: frontend, backend, outils, clear ou exit",
        ]);
        setInput("");
        setSuggestions([]);
        setSelectedSuggestion(-1);
      }
    }
  };

  const closeFolder = () => {
    setSelectedCategory(null);
    setInput("");
  };

  useEffect(() => {
    if (inputRef.current) {
      // Désactivé pour éviter le scroll automatique
      // inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // S'assurer que selectedCategory reste null au chargement
    setSelectedCategory(null);
  }, []);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true);
        const data = await getCompetencesByCategory();
        const transformedData = {};

        const validCategories = ["frontend", "backend", "outils"];
        for (const cat of validCategories) {
          transformedData[cat] = [];
        }

        for (const [category, competences] of Object.entries(data)) {
          const transformedCompetences = competences.map((comp) => ({
            name: comp.nom,
            level: comp.niveau,
            description: comp.description,
            anneesExperience: comp.anneesExperience,
            icone: comp.icone,
            id: comp.id,
          }));

          if (transformedData[category]) {
            transformedData[category] = transformedCompetences;
          } else {
            for (const validCat of validCategories) {
              if (category.includes(validCat)) {
                transformedData[validCat].push(...transformedCompetences);
              }
            }
          }
        }

        setSkills(transformedData);
      } catch (err) {
        console.error("Erreur lors du chargement des compétences:", err);
        setHistory((prev) => [
          ...prev,
          "Erreur: Impossible de charger les compétences",
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  if (selectedCategory) {
    return (
      <SkillsFolderViewer
        category={selectedCategory}
        skills={skills[selectedCategory] || []}
        onClose={closeFolder}
        categoryName={categoryNames[selectedCategory]}
      />
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-linear-to-b from-base-900 via-base-900 to-base-800 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-base-content/70">Chargement des compétences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-base-900 via-base-900 to-base-800 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8 space-y-3 md:space-y-4">
          <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-base-content">
            Mes Compétences
          </h2>
          <p className="text-xs md:text-sm lg:text-base text-base-content/70 max-w-2xl">
            Explorez mes compétences techniques en sélectionnant une catégorie
            ci-dessous. Cliquez sur les boutons de commande ou tapez directement
            dans le terminal.
          </p>
        </div>

        <div
          onClick={() => inputRef.current?.focus()}
          className="rounded-xl md:rounded-2xl overflow-hidden border border-primary/20 shadow-2xl cursor-text"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(80, 50, 200, 0.1) 100%)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="bg-linear-to-r from-base-900 to-base-800 border-b border-primary/10 px-4 md:px-6 lg:px-6 py-3 md:py-4 lg:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs md:text-sm lg:text-sm font-mono text-primary/60">
              skills-terminal.vps
            </span>
          </div>

          <div className="p-4 md:p-6 lg:p-8 font-mono text-xs md:text-sm lg:text-sm space-y-3 md:space-y-4 lg:space-y-4 min-h-80 md:min-h-96 lg:min-h-96">
            <div className="space-y-2 md:space-y-3 lg:space-y-3 text-base-content/80">
              {history.map((line, idx) => (
                <div
                  key={idx}
                  className="text-xs md:text-xs lg:text-xs leading-relaxed"
                >
                  {line && (
                    <>
                      <span className="text-primary font-semibold">
                        bryan-menoux@vps
                      </span>
                      <span className="text-base-content/50"> {">"} </span>
                      <span className="text-primary/80">$/competences/</span>
                      <span className="ml-2">{line}</span>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1 md:gap-2 lg:gap-2 pt-3 md:pt-4 lg:pt-4 border-t border-primary/10">
              <span className="text-primary font-semibold">
                bryan-menoux@vps
              </span>
              <span className="text-base-content/50 hidden md:inline lg:inline">
                {" "}
                {">"}{" "}
              </span>
              <span className="text-primary/80 hidden md:inline lg:inline">
                $/competences/
              </span>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent outline-none text-base-content font-mono text-xs md:text-sm lg:text-sm placeholder-base-content/30"
                  placeholder="frontend | backend | outils | clear | exit"
                  spellCheck="false"
                />

                {suggestions.length > 0 && (
                  <div className="absolute left-0 top-full mt-1 md:mt-2 lg:mt-2 bg-base-800 border border-primary/30 rounded-lg shadow-lg overflow-hidden z-50 min-w-max max-w-xs md:max-w-sm lg:max-w-sm">
                    {suggestions.map((suggestion, idx) => {
                      const isComplete =
                        input.trim().toLowerCase() === suggestion.toLowerCase();
                      return (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setInput(suggestion);
                            setSuggestions([]);
                            setSelectedSuggestion(-1);
                            inputRef.current?.focus();
                          }}
                          className={`w-full px-3 md:px-4 lg:px-4 py-1.5 md:py-2 lg:py-2 text-left font-mono text-xs md:text-sm lg:text-sm transition-colors ${
                            idx === selectedSuggestion
                              ? "bg-primary/30 text-primary"
                              : "text-base-content/70 hover:bg-primary/10 hover:text-primary"
                          }`}
                        >
                          <span className="text-primary/60">$ </span>
                          {suggestion}
                          {!isComplete && (
                            <span className="text-base-content/40 ml-2">
                              (tab)
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-primary/10 bg-base-900/50 px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-4">
            <div className="text-xs md:text-xs lg:text-xs text-base-content/60 space-y-2 md:space-y-3 lg:space-y-3">
              <div className="flex items-center gap-2 mb-2 md:mb-3 lg:mb-3">
                <MousePointer2 size={14} className="text-primary" />
                <span className="font-mono text-primary text-xs md:text-xs lg:text-xs">
                  Cliquez ou tapez:
                </span>
              </div>
              <div className="flex gap-2 md:gap-3 lg:gap-3 flex-wrap">
                {["frontend", "backend", "outils"].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => {
                      setInput("");
                      setSelectedCategory(cmd);
                      setHistory([...history, cmd]);
                      setSuggestions([]);
                      setSelectedSuggestion(-1);
                    }}
                    disabled={
                      loading || !skills[cmd] || skills[cmd].length === 0
                    }
                    className="px-2 md:px-3 lg:px-3 py-1 md:py-1.5 lg:py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/40 hover:border-primary/80 text-primary font-mono text-xs md:text-xs lg:text-xs transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="group-hover:text-accent transition-colors">
                      ${cmd}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setHistory([""]);
                    setInput("");
                    setSelectedCategory(null);
                    setSuggestions([]);
                    setSelectedSuggestion(-1);
                  }}
                  className="px-2 md:px-3 lg:px-3 py-1 md:py-1.5 lg:py-1.5 rounded-lg bg-base-700/40 hover:bg-base-700/60 border border-base-600/40 hover:border-base-600/80 text-base-content/70 hover:text-base-content font-mono text-xs md:text-xs lg:text-xs transition-all duration-200 hover:shadow-lg hover:shadow-base-700/20 cursor-pointer"
                >
                  clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillsFolderViewer = ({ category, skills, onClose, categoryName }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getLevelLabel = (level) => {
    if (level < 25) return "Basique";
    if (level < 50) return "En cours d'apprentissage";
    if (level < 75) return "Avancé";
    return "Maîtrisé";
  };

  const getLevelColor = (level) => {
    if (level < 25) return "text-warning";
    if (level < 50) return "text-info";
    if (level < 75) return "text-accent";
    return "text-success";
  };

  const getBgColor = (level) => {
    if (level < 25) return "bg-warning/5 border-warning/20";
    if (level < 50) return "bg-info/5 border-info/20";
    if (level < 75) return "bg-accent/5 border-accent/20";
    return "bg-success/5 border-success/20";
  };

  const getProgressColor = (level) => {
    if (level < 25) return "from-warning to-warning/50";
    if (level < 50) return "from-info to-info/50";
    if (level < 75) return "from-accent to-accent/50";
    return "from-success to-success/50";
  };

  const formatExperience = (years) => {
    if (years < 1) {
      const months = Math.round(years * 12);
      return `${months} mois`;
    }
    return `${years} an${years > 1 ? "s" : ""}`;
  };
  const skillsPerPage = 6;

  const totalPages = Math.ceil(skills.length / skillsPerPage);
  const startIndex = (currentPage - 1) * skillsPerPage;
  const paginatedSkills = skills.slice(startIndex, startIndex + skillsPerPage);

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-base-900 via-base-900 to-base-800 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8 lg:mb-8 flex flex-col md:flex-row gap-3 md:gap-4 lg:gap-4 items-start md:items-center">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 md:px-4 lg:px-4 py-2 rounded-lg bg-base-800/50 hover:bg-base-800 border border-base-700 hover:border-primary/30 transition-all text-xs md:text-sm lg:text-sm text-base-content/80 hover:text-primary group"
          >
            <ChevronRight size={14} className="rotate-180" />
            <span>Voir toutes les compétences</span>
          </button>
          <div className="flex items-center gap-1 md:gap-2 lg:gap-2 text-xs md:text-sm lg:text-sm font-mono text-primary/60 flex-wrap">
            <button
              onClick={onClose}
              className="hover:text-primary transition-colors cursor-pointer text-primary/80"
            >
              📁 /competences/
            </button>
            <ChevronRight size={14} className="hidden md:block lg:block" />
            <button
              onClick={() => setSelectedSkill(null)}
              className="text-primary hover:text-accent transition-colors cursor-pointer"
            >
              {category}
            </button>
            {selectedSkill && (
              <>
                <ChevronRight size={14} className="hidden md:block lg:block" />
                <span className="text-accent text-xs md:text-sm lg:text-sm md:hidden lg:hidden">
                  /{selectedSkill.name}
                </span>
                <span className="text-accent text-xs md:text-sm lg:text-sm hidden md:inline lg:inline">
                  {selectedSkill.name}
                </span>
              </>
            )}
          </div>
        </div>

        <div
          className="rounded-2xl md:rounded-3xl lg:rounded-3xl overflow-hidden border border-primary/20 shadow-2xl backdrop-blur"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(80, 50, 200, 0.08) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="bg-linear-to-r from-base-900 to-base-800 border-b border-primary/10 px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6 flex items-center justify-between gap-2 md:gap-3 lg:gap-3">
            <div className="flex items-center gap-2 md:gap-3 lg:gap-3 min-w-0">
              <Folder className="text-primary shrink-0" size={20} />
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl lg:text-xl font-bold text-base-content capitalize truncate">
                  {categoryName}
                </h2>
                <p className="text-xs md:text-xs lg:text-xs text-base-content/50 font-mono truncate">
                  /competences/{category}/
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-base-700 rounded-lg transition-colors shrink-0"
              aria-label="Fermer"
            >
              <X size={18} className="text-base-content/60" />
            </button>
          </div>

          <div className="p-4 md:p-6 lg:p-8">
            {selectedSkill ? (
              <div className="space-y-6 md:space-y-8 lg:space-y-8">
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="flex items-center gap-2 px-3 md:px-4 lg:px-4 py-2 rounded-lg bg-base-800/50 hover:bg-base-800 border border-base-700 hover:border-primary/30 transition-all text-xs md:text-sm lg:text-sm text-base-content/80 hover:text-primary font-mono mb-4 md:mb-6 lg:mb-6 group"
                >
                  <ChevronRight
                    size={14}
                    className="rotate-180 group-hover:-translate-x-1 transition-transform"
                  />
                  <span>Voir toutes les compétences</span>
                </button>

                <div className="max-w-2xl">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-6">
                    {selectedSkill.icone ? (
                      <img
                        src={selectedSkill.icone}
                        alt={selectedSkill.name}
                        className="w-20 md:w-24 lg:w-24 h-20 md:h-24 lg:h-24 object-contain shrink-0"
                      />
                    ) : (
                      <div className="text-5xl md:text-6xl lg:text-6xl shrink-0">
                        🔧
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl md:text-3xl lg:text-3xl font-bold text-base-content mb-2">
                        {selectedSkill.name}
                      </h3>
                      {selectedSkill.description && (
                        <p className="text-base-content/70 text-xs md:text-sm lg:text-sm mb-4 italic">
                          {selectedSkill.description}
                        </p>
                      )}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs md:text-sm lg:text-sm font-mono text-base-content/70">
                              Compétence
                            </span>
                            <span className="text-xs md:text-sm lg:text-sm font-mono text-primary font-bold">
                              {selectedSkill.level}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-base-700 rounded-full overflow-hidden border border-primary/20">
                            <div
                              className={`h-full bg-linear-to-r ${getProgressColor(
                                selectedSkill.level
                              )} rounded-full transition-all duration-500`}
                              style={{ width: `${selectedSkill.level}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-4 pt-4 md:pt-6 lg:pt-6">
                          <div
                            className={`p-3 md:p-4 lg:p-4 rounded-lg ${getBgColor(
                              selectedSkill.level
                            )} border`}
                          >
                            <p className="text-xs text-base-content/60 font-mono mb-1">
                              NIVEAU
                            </p>
                            <p
                              className={`text-xs md:text-sm lg:text-sm font-bold ${getLevelColor(
                                selectedSkill.level
                              )}`}
                            >
                              {getLevelLabel(selectedSkill.level)}
                            </p>
                          </div>
                          <div className="p-3 md:p-4 lg:p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-xs text-base-content/60 font-mono mb-1">
                              EXPÉRIENCE
                            </p>
                            <p className="text-xs md:text-sm lg:text-sm font-bold text-primary">
                              {formatExperience(selectedSkill.anneesExperience)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 md:space-y-8 lg:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
                  {paginatedSkills.map((skill) => (
                    <button
                      key={skill.name}
                      onClick={() => setSelectedSkill(skill)}
                      className="p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 border border-primary/10 hover:border-primary/40 group text-left w-full hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 active:translate-y-0 active:shadow-none"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(80, 50, 200, 0.1) 0%, rgba(118, 95, 243, 0.05) 100%)",
                      }}
                    >
                      <div className="flex items-start justify-between mb-3 md:mb-4 lg:mb-4">
                        {skill.icone ? (
                          <img
                            src={skill.icone}
                            alt={skill.name}
                            className="w-10 md:w-12 lg:w-12 h-10 md:h-12 lg:h-12 object-contain group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <span className="text-3xl md:text-4xl lg:text-4xl group-hover:scale-110 transition-transform">
                            🔧
                          </span>
                        )}
                        <ChevronRight
                          size={16}
                          className="text-primary/0 group-hover:text-primary transition-all group-hover:translate-x-1 shrink-0"
                        />
                      </div>
                      <h3 className="text-base md:text-lg lg:text-lg font-bold text-base-content mb-2 md:mb-3 lg:mb-3 group-hover:text-primary transition-colors">
                        {skill.name}
                      </h3>
                      <div className="space-y-1 md:space-y-2 lg:space-y-2">
                        <div className="w-full h-1.5 bg-base-700 rounded-full overflow-hidden border border-primary/10">
                          <div
                            className={`h-full bg-linear-to-r ${getProgressColor(
                              skill.level
                            )} rounded-full`}
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                        <p className="text-xs font-mono text-base-content/50">
                          {getLevelLabel(skill.level)}: {skill.level}%
                        </p>
                      </div>
                      <div className="mt-3 md:mt-4 lg:mt-4 flex items-center gap-2 text-xs text-primary/60 group-hover:text-primary transition-colors">
                        <span>Voir les détails</span>
                        <ChevronRight
                          size={12}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 md:gap-2 lg:gap-2 pt-6 md:pt-8 lg:pt-8 border-t border-primary/10">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-2 md:px-3 lg:px-3 py-1.5 md:py-2 lg:py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs md:text-sm lg:text-sm"
                    >
                      ← Précédent
                    </button>

                    <div className="flex items-center gap-1 md:gap-2 lg:gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 md:w-8 lg:w-8 h-7 md:h-8 lg:h-8 rounded-lg font-mono text-xs transition-all ${
                              currentPage === page
                                ? "bg-primary text-base-900 font-bold"
                                : "border border-primary/30 text-primary/70 hover:bg-primary/10"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-2 md:px-3 lg:px-3 py-1.5 md:py-2 lg:py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs md:text-sm lg:text-sm"
                    >
                      Suivant →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsTerminal;
