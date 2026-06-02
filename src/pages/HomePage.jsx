import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import NodeBackground from "../components/NodeBackground/NodeBackground";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "../components/Auth/AuthModal";
import ChangePasswordModal from "../components/Auth/ChangePasswordModal";
import DeleteAccountModal from "../components/Auth/DeleteAccountModal";
import ProfileMenu from "../components/Profile/ProfileMenu";
import UploadToast from "../components/Upload/UploadToast";

const UNIDADE_VALUES = [
  "Escola de Artes, Ciências e Humanidades - ( EACH )",
  "Escola de Comunicações e Artes - ( ECA )",
  "Escola de Educação Física e Esporte - ( EEFE )",
  "Escola de Educação Física e Esporte de Ribeirão Preto - ( EEFERP )",
  "Escola de Enfermagem - ( EE )",
  "Escola de Enfermagem de Ribeirão Preto - ( EERP )",
  "Escola de Engenharia de Lorena - ( EEL )",
  "Escola de Engenharia de São Carlos - ( EESC )",
  "Escola de Engenharia de São Carlos e Instituto de Ciências Matemáticas e de Computação - ( EESC e ICMC )",
  "Escola Politécnica - ( EP )",
  'Escola Superior de Agricultura "Luiz de Queiroz" - ( ESALQ )',
  "Faculdade de Arquitetura e Urbanismo e de Design - ( FAU )",
  "Faculdade de Ciências Farmacêuticas - ( FCF )",
  "Faculdade de Ciências Farmacêuticas de Ribeirão Preto - ( FCFRP )",
  "Faculdade de Direito - ( FD )",
  "Faculdade de Direito de Ribeirão Preto - ( FDRP )",
  "Faculdade de Economia, Administração e Contabilidade de Ribeirão Preto - ( FEARP )",
  "Faculdade de Economia, Administração, Contabilidade e Atuária - ( FEA )",
  "Faculdade de Educação - ( FE )",
  "Faculdade de Filosofia, Ciências e Letras de Ribeirão Preto - ( FFCLRP )",
  "Faculdade de Filosofia, Letras e Ciências Humanas - ( FFLCH )",
  "Faculdade de Medicina - ( FM )",
  "Faculdade de Medicina de Bauru - ( FMBRU )",
  "Faculdade de Medicina de Ribeirão Preto - ( FMRP )",
  "Faculdade de Medicina Veterinária e Zootecnia - ( FMVZ )",
  "Faculdade de Odontologia - ( FO )",
  "Faculdade de Odontologia de Bauru - ( FOB )",
  "Faculdade de Odontologia de Ribeirão Preto - ( FORP )",
  "Faculdade de Saúde Pública - ( FSP )",
  "Faculdade de Zootecnia e Engenharia de Alimentos - ( FZEA )",
  "Física Médica - Instituto de Física e Faculdade de Medicina - ( Física Méd - IF e FM )",
  "Instituto de Arquitetura e Urbanismo de São Carlos - ( IAU )",
  "Instituto de Astronomia, Geofísica e Ciências Atmosféricas - ( IAG )",
  "Instituto de Biociências - ( IB )",
  "Instituto de Ciências Biomédicas - ( ICB )",
  "Instituto de Ciências Matemáticas e de Computação - ( ICMC )",
  "Instituto de Física - ( IF )",
  "Instituto de Física de São Carlos - ( IFSC )",
  "Instituto de Geociências - ( IGc )",
  "Instituto de Matemática e Estatística - ( IME )",
  "Instituto de Psicologia - ( IP )",
  "Instituto de Química - ( IQ )",
  "Instituto de Química de São Carlos - ( IQSC )",
  "Instituto de Relações Internacionais - ( IRI )",
  "Instituto Oceanográfico - ( IO )",
  "Interunidades de Licenciatura IFSC/IQSC/ICMC - ( Inter IFSC/IQSC/ICMC )",
  "Pró-Reitoria de Graduação - ( Pró-G )",
];

function matchUnidade(pdfUnidade) {
  const normalized = pdfUnidade.trim().replace(/\s+/g, " ");
  return UNIDADE_VALUES.find((opt) => {
    const namePart = opt.replace(/\s*-\s*\(.*\)\s*$/, "").trim();
    return namePart === normalized;
  }) || null;
}

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function matchCurso(pdfCurso, listaCursos) {
  const normalizedPdf = normalize(pdfCurso);
  const exact = listaCursos.find((c) => normalize(c) === normalizedPdf);
  if (exact) return exact;
  return listaCursos.find(
    (c) => normalize(c).includes(normalizedPdf) || normalizedPdf.includes(normalize(c))
  ) || null;
}

const LoadingSpinner = () => (
  <div className="flex items-center gap-1.5">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`w-1.5 h-10 rounded-full animate-bounce ${i % 2 === 0 ? "bg-primary-DEFAULT" : "bg-secondary-DEFAULT"}`}
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ))}
  </div>
);

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [unidade, setUnidade] = useState("");
    const [curso, setCurso] = useState("");
    const [listaCursos, setListaCursos] = useState([]);
    const [isLoadingCursos, setIsLoadingCursos] = useState(false);

  const { isLoggedIn, uploadHistory, pollProcessing, setHistoricoStatus, fetchPreferences, savePreferences } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(() => {
    if (isLoggedIn || location.state?.fromGraph) return false;
    return true;
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deletedAccount, setDeletedAccount] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadError, setUploadError] = useState("");

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleUpload = async (file) => {
    setUploadStatus("uploading");
    setUploadError("");
    try {
      const processamentoId = await uploadHistory(file);
      const poll = setInterval(async () => {
        try {
          const result = await pollProcessing(processamentoId);
          if (result.status === "concluido") {
            clearInterval(poll);
            setHistoricoStatus(result.resultado);
            setUploadStatus("done");
            const { unidade: pdfUnidade, curso: pdfCurso } = result.resultado || {};
            if (pdfUnidade && pdfCurso) {
              const matchedUnidade = matchUnidade(pdfUnidade) || pdfUnidade;
              setUnidade(matchedUnidade);
              try { localStorage.setItem("roadusp_unidade", matchedUnidade); } catch (e) {}
              setIsLoadingCursos(true);
              try {
                const response = await api.get(`/api/v1/cursos/lista?unidade=${matchedUnidade}`);
                setListaCursos(response.data.cursos);
                const matchedCurso = matchCurso(pdfCurso, response.data.cursos);
                if (matchedCurso) {
                  setCurso(matchedCurso);
                  try { localStorage.setItem("roadusp_curso", matchedCurso); } catch (e) {}
                  if (isLoggedIn) savePreferences(matchedUnidade, matchedCurso).catch(() => {});
                }
              } catch (e) {}
              setIsLoadingCursos(false);
            }
          } else if (result.status === "erro") {
            clearInterval(poll);
            setUploadStatus("error");
            setUploadError(result.erro || "Erro ao processar o histórico.");
          }
        } catch {
          clearInterval(poll);
          setUploadStatus("error");
          setUploadError("Erro de conexão ao verificar o processamento.");
        }
      }, 2000);
    } catch (err) {
      setUploadStatus("error");
      const data = err.response?.data;
      setUploadError(data?.error || "Erro ao enviar o arquivo.");
    }
  };

  const handleUploadDismiss = () => {
    setUploadStatus("idle");
    setUploadError("");
  };

  useEffect(() => {
    api.get("/ping").catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchPreferences().then(async (prefs) => {
      if (!prefs.unidade) return;
      setUnidade(prefs.unidade);
      try { localStorage.setItem("roadusp_unidade", prefs.unidade); } catch (e) {}
      try {
        const response = await api.get(`/api/v1/cursos/lista?unidade=${prefs.unidade}`);
        setListaCursos(response.data.cursos);
        if (prefs.curso && response.data.cursos.includes(prefs.curso)) {
          setCurso(prefs.curso);
        }
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
      }
    }).catch(() => {});
  }, [isLoggedIn, fetchPreferences]);

  const handleSelectUnidade = async (unidade) => {
        setUnidade(unidade);
        try { localStorage.setItem("roadusp_unidade", unidade); } catch (e) {}
        setCurso("");
        setListaCursos([]);
        setIsLoadingCursos(true);

        try {
            const response = await api.get(`/api/v1/cursos/lista?unidade=${unidade}`);
            setListaCursos(response.data.cursos);
            try {
                const savedCurso = localStorage.getItem("roadusp_curso");
                if (savedCurso && response.data.cursos.includes(savedCurso)) {
                    setCurso(savedCurso);
                    if (isLoggedIn) savePreferences(unidade, savedCurso).catch(() => {});
                }
            } catch (e) {}
        } catch (error) {
            console.error("Erro ao carregar cursos:", error);
            alert("Erro ao carregar cursos. Tente novamente.");
        } finally {
            setIsLoadingCursos(false);
        }
    }

    const handleClick = async () => {
        if (unidade === ""){
            alert("Selecione uma unidade!")
        } else if (curso === ""){
            alert("Selecione um curso")
        } else{
            setNavigating(true);
            try {
                const response = await api.get(`/api/v1/cursos/disciplinas?unidade=${unidade}&curso=${curso}`);
                navigate(`/graph?unidade=${encodeURIComponent(unidade)}&curso=${encodeURIComponent(curso)}`, {
                    state: { graphData: response.data }
                });
            } catch (error) {
                console.error("Erro ao carregar disciplinas:", error);
                alert("Erro ao carregar dados do curso. Tente novamente.");
                setNavigating(false);
            }
        }
    }

  return (
    <div className="relative min-h-screen w-full bg-surface-base flex flex-col items-center justify-center p-4 overflow-hidden">
      <NodeBackground />

      <div className="fixed top-4 right-4 z-50">
        <ProfileMenu
          onChangePasswordClick={() => setShowChangePassword(true)}
          onDeleteAccountClick={() => setShowDeleteAccount(true)}
          onUpload={handleUpload}
          onLoginClick={() => setShowAuthModal(true)}
        />
      </div>

      {showAuthModal && <AuthModal onClose={handleCloseAuthModal} />}

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}

      {showDeleteAccount && (
        <DeleteAccountModal
          onClose={() => setShowDeleteAccount(false)}
          onDeleted={() => {
            setShowDeleteAccount(false);
            setDeletedAccount(true);
            setTimeout(() => setDeletedAccount(false), 5000);
          }}
        />
      )}

      <UploadToast
        status={uploadStatus}
        message={uploadError}
        onDismiss={handleUploadDismiss}
      />

      {deletedAccount && (
        <div className="fixed bottom-6 right-6 z-[1000] animate-in fade-in slide-in-from-right-4">
          <div className="bg-surface-card backdrop-blur-xl border border-border-subtle rounded-xl px-5 py-4 shadow-2xl min-w-[220px]">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-semantic-success/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <path d="M3 7l3 3 5-5" />
                </svg>
              </div>
              <span className="text-text-primary text-sm font-medium">Usuário deletado com sucesso</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Loading Overlay */}
        {isLoadingCursos && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-base/60 backdrop-blur-sm">
            <div className="bg-surface-card p-8 rounded-3xl shadow-2xl border border-border-subtle">
              <LoadingSpinner />
            </div>
          </div>
        )}

        {navigating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-base/60 backdrop-blur-sm">
            <div className="bg-surface-card p-8 rounded-3xl shadow-2xl border border-border-subtle">
              <LoadingSpinner />
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
            <span className="text-primary-DEFAULT">Road</span>
            <span className="text-secondary-DEFAULT">USP</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            Visualize as relações entre as disciplinas do seu curso de forma interativa.
          </p>
        </div>

        {/* Search Card */}
        <div className="relative w-full max-w-xl">
          <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-r from-primary-400 via-primary-DEFAULT to-secondary-DEFAULT opacity-50 blur-sm" />
          <div className="relative w-full bg-surface-card backdrop-blur-xl border border-border-subtle p-8 rounded-[2rem] shadow-2xl space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label className="text-xs font-bold uppercase tracking-widest text-primary-DEFAULT ml-1 mb-2 block">Unidade</label>
                <select
                  className="w-full bg-surface-elevated/50 border border-border-default text-text-primary rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary-DEFAULT transition-all appearance-none cursor-pointer"
                  onChange={e => handleSelectUnidade(e.target.value)}
                  value={unidade}
                >
                  <option value="" disabled>Selecione a unidade...</option>
                  <option value="Escola de Artes, Ciências e Humanidades - ( EACH )">Escola de Artes, Ciências e Humanidades - (EACH)</option>
                    <option value="Escola de Comunicações e Artes - ( ECA )">Escola de Comunicações e Artes - (ECA)</option>
                    <option value="Escola de Educação Física e Esporte - ( EEFE )">Escola de Educação Física e Esporte - (EEFE)</option>
                    <option value="Escola de Educação Física e Esporte de Ribeirão Preto - ( EEFERP )">Escola de Educação Física e Esporte de Ribeirão Preto - (EEFERP)</option>
                    <option value="Escola de Enfermagem - ( EE )">Escola de Enfermagem - (EE)</option>
                    <option value="Escola de Enfermagem de Ribeirão Preto - ( EERP )">Escola de Enfermagem de Ribeirão Preto - (EERP)</option>
                    <option value="Escola de Engenharia de Lorena - ( EEL )">Escola de Engenharia de Lorena - (EEL)</option>
                    <option value="Escola de Engenharia de São Carlos - ( EESC )">Escola de Engenharia de São Carlos - (EESC)</option>
                    <option value="Escola de Engenharia de São Carlos e Instituto de Ciências Matemáticas e de Computação - ( EESC e ICMC )">Escola de Engenharia de São Carlos e Instituto de Ciências Matemáticas e de Computação - (EESC e ICMC)</option>
                    <option value="Escola Politécnica - ( EP )">Escola Politécnica - (EP)</option>
                    <option value="Escola Superior de Agricultura &quot;Luiz de Queiroz&quot; - ( ESALQ )">Escola Superior de Agricultura "Luiz de Queiroz" - (ESALQ)</option>
                    <option value="Faculdade de Arquitetura e Urbanismo e de Design - ( FAU )">Faculdade de Arquitetura e Urbanismo e de Design - (FAU)</option>
                    <option value="Faculdade de Ciências Farmacêuticas - ( FCF )">Faculdade de Ciências Farmacêuticas - (FCF)</option>
                    <option value="Faculdade de Ciências Farmacêuticas de Ribeirão Preto - ( FCFRP )">Faculdade de Ciências Farmacêuticas de Ribeirão Preto - (FCFRP)</option>
                    <option value="Faculdade de Direito - ( FD )">Faculdade de Direito - (FD)</option>
                    <option value="Faculdade de Direito de Ribeirão Preto - ( FDRP )">Faculdade de Direito de Ribeirão Preto - (FDRP)</option>
                    <option value="Faculdade de Economia, Administração e Contabilidade de Ribeirão Preto - ( FEARP )">Faculdade de Economia, Administração e Contabilidade de Ribeirão Preto - (FEARP)</option>
                    <option value="Faculdade de Economia, Administração, Contabilidade e Atuária - ( FEA )">Faculdade de Economia, Administração, Contabilidade e Atuária - (FEA)</option>
                    <option value="Faculdade de Educação - ( FE )">Faculdade de Educação - (FE)</option>
                    <option value="Faculdade de Filosofia, Ciências e Letras de Ribeirão Preto - ( FFCLRP )">Faculdade de Filosofia, Ciências e Letras de Ribeirão Preto - (FFCLRP)</option>
                    <option value="Faculdade de Filosofia, Letras e Ciências Humanas - ( FFLCH )">Faculdade de Filosofia, Letras e Ciências Humanas - (FFLCH)</option>
                    <option value="Faculdade de Medicina - ( FM )">Faculdade de Medicina - (FM)</option>
                    <option value="Faculdade de Medicina de Bauru - ( FMBRU )">Faculdade de Medicina de Bauru - (FMBRU)</option>
                    <option value="Faculdade de Medicina de Ribeirão Preto - ( FMRP )">Faculdade de Medicina de Ribeirão Preto - (FMRP)</option>
                    <option value="Faculdade de Medicina Veterinária e Zootecnia - ( FMVZ )">Faculdade de Medicina Veterinária e Zootecnia - (FMVZ)</option>
                    <option value="Faculdade de Odontologia - ( FO )">Faculdade de Odontologia - (FO)</option>
                    <option value="Faculdade de Odontologia de Bauru - ( FOB )">Faculdade de Odontologia de Bauru - (FOB)</option>
                    <option value="Faculdade de Odontologia de Ribeirão Preto - ( FORP )">Faculdade de Odontologia de Ribeirão Preto - (FORP)</option>
                    <option value="Faculdade de Saúde Pública - ( FSP )">Faculdade de Saúde Pública - (FSP)</option>
                    <option value="Faculdade de Zootecnia e Engenharia de Alimentos - ( FZEA )">Faculdade de Zootecnia e Engenharia de Alimentos - (FZEA)</option>
                    <option value="Física Médica - Instituto de Física e Faculdade de Medicina - ( Física Méd - IF e FM )">Física Médica - Instituto de Física e Faculdade de Medicina - (Física Méd - IF e FM)</option>
                    <option value="Instituto de Arquitetura e Urbanismo de São Carlos - ( IAU )">Instituto de Arquitetura e Urbanismo de São Carlos - (IAU)</option>
                    <option value="Instituto de Astronomia, Geofísica e Ciências Atmosféricas - ( IAG )">Instituto de Astronomia, Geofísica e Ciências Atmosféricas - (IAG)</option>
                    <option value="Instituto de Biociências - ( IB )">Instituto de Biociências - (IB)</option>
                    <option value="Instituto de Ciências Biomédicas - ( ICB )">Instituto de Ciências Biomédicas - (ICB)</option>
                    <option value="Instituto de Ciências Matemáticas e de Computação - ( ICMC )">Instituto de Ciências Matemáticas e de Computação - (ICMC)</option>
                    <option value="Instituto de Física - ( IF )">Instituto de Física - (IF)</option>
                    <option value="Instituto de Física de São Carlos - ( IFSC )">Instituto de Física de São Carlos - (IFSC)</option>
                    <option value="Instituto de Geociências - ( IGc )">Instituto de Geociências - (IGc)</option>
                    <option value="Instituto de Matemática e Estatística - ( IME )">Instituto de Matemática e Estatística - (IME)</option>
                    <option value="Instituto de Psicologia - ( IP )">Instituto de Psicologia - (IP)</option>
                    <option value="Instituto de Química - ( IQ )">Instituto de Química - (IQ)</option>
                    <option value="Instituto de Química de São Carlos - ( IQSC )">Instituto de Química de São Carlos - (IQSC)</option>
                    <option value="Instituto de Relações Internacionais - ( IRI )">Instituto de Relações Internacionais - (IRI)</option>
                    <option value="Instituto Oceanográfico - ( IO )">Instituto Oceanográfico - (IO)</option>
                    <option value="Interunidades de Licenciatura IFSC/IQSC/ICMC - ( Inter IFSC/IQSC/ICMC )">Interunidades de Licenciatura IFSC/IQSC/ICMC - (Inter IFSC/IQSC/ICMC)</option>
                    <option value="Pró-Reitoria de Graduação - ( Pró-G )">Pró-Reitoria de Graduação - (Pró-G)</option>
                </select>
              </div>

              <div className="group">
                <label className="text-xs font-bold uppercase tracking-widest text-secondary-DEFAULT ml-1 mb-2 block">Curso</label>
                <select
                  className="w-full bg-surface-elevated/50 border border-border-default text-text-primary rounded-xl p-4 outline-none focus:ring-2 focus:ring-secondary-DEFAULT transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={e => {
                    const v = e.target.value;
                    setCurso(v);
                    try { localStorage.setItem("roadusp_curso", v); } catch (e) {}
                    if (isLoggedIn && unidade) savePreferences(unidade, v).catch(() => {});
                  }}
                  disabled={!unidade}
                  value={curso}
                >
                  <option value="" disabled>Selecione o curso...</option>
                  {listaCursos.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleClick}
              className="group relative w-full overflow-hidden bg-gradient-to-r from-primary-DEFAULT to-primary-700 hover:from-accent-teal hover:to-primary-DEFAULT text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-DEFAULT/20 transform transition hover:scale-[1.02] active:scale-95 text-lg cursor-pointer"
            >
              <span className="relative z-10">Explorar Grade Curricular</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            </button>
          </div>
        </div>

        {/* Info Badges */}
        <div className="mt-12 flex flex-col gap-3 items-center">
          <div className="bg-surface-card border border-border-subtle px-4 py-2 rounded-full text-xs text-text-secondary flex items-center gap-2">
            <span className="w-2 h-2 bg-semantic-success rounded-full animate-pulse" />
            Disciplinas com requisitos numéricos atualizadas
          </div>
          <a
            href="https://github.com/Augusto-Ildefonso/roadusp"
            className="text-text-muted hover:text-text-primary text-sm transition-colors"
          >
            Contribuir no GitHub →
          </a>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-8">
          <p className="text-text-muted font-medium tracking-wide">
            Developed by <span className="text-text-secondary">Augusto Ildefonso</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
