import React, {use, useState} from "react";
import { useNavigate } from "react-router-dom";
import "../style/HomePage.css";
import axios from "axios";

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner-bar bar1"></div>
            <div className="spinner-bar bar2"></div>
            <div className="spinner-bar bar3"></div>
            <div className="spinner-bar bar4"></div>
            <div className="spinner-bar bar5"></div>
        </div>
    );
};

const HomePage = () => {
    const navigate = useNavigate();
    const [unidade, setUnidade] = useState('');
    const [curso, setCurso] = useState('');
    const [listaCursos, setListaCursos] = useState([]); 
    const [isLoadingCursos, setIsLoadingCursos] = useState(false);

    const handleSelectUnidade = async (unidade) => {
        setUnidade(unidade);
        setCurso(''); // Limpa o curso selecionado
        setListaCursos([]); // Limpa a lista de cursos
        setIsLoadingCursos(true); // Inicia o loading
        
        try {
            const response = await axios.get(`https://roadusp-backend.onrender.com/listacursos?unidade=${unidade}`);
            setListaCursos(response.data.cursos);
        } catch (error) {
            console.error('Erro ao carregar cursos:', error);
            alert('Erro ao carregar cursos. Tente novamente.');
        } finally {
            setIsLoadingCursos(false); // Para o loading
        }
    }

    const handleSelectCurso = (curso) => {
        setCurso(curso)
    }

    const handleClick = () => {
        if (unidade === ''){
            alert("Selecione uma unidade!")
        } else if (curso === ''){
            alert("Selecione um curso")
        } else{
            navigate(`/graph?unidade=${unidade}&curso=${curso}`)
        }
    }    
    
    return(
        <div className="HomePage">
            {isLoadingCursos && (
                <div className="loading-overlay">
                    <div className="loading-spinner-center">
                        <LoadingSpinner />
                    </div>
                </div>
            )}
            
            <h1 className="Title"><span style={{"color": "#1094ab"}}>Road</span><span style={{"color": "#fcb421"}}>USP</span></h1>
            <h2 className="text">Visualize facilmente as relações entre disciplinas do seu curso.</h2>
            <div className="selectMenu">
                <h1>Selecione a unidade:</h1>
                <select 
                className="dropdownSelect"
                onChange={e => handleSelectUnidade(e.target.value)}>
                    <option value="" disabled selected>Unidades</option>
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

                <h1>Selecione o curso:</h1>
                <select 
                className="dropdownSelect"
                onChange={e => handleSelectCurso(e.target.value)}
                disabled={unidade === ''}
                value={curso}>
                    <option value="" disabled>Cursos</option>
                    {listaCursos.map((cursoItem, index) => (
                        <option key={index} value={cursoItem}>
                            {cursoItem}
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={() => handleClick()} className="buttonSearch">
                Buscar
            </button>

        </div>
    );
}

export default HomePage;