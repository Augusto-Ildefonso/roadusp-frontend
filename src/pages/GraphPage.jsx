    import React, { useEffect, useState } from "react";
    import { useSearchParams } from "react-router-dom";
    import Graph from "../components/Graph/Graph";
    import "../style/GraphPage.css";
    import axios from "axios";

    const GraphPage = () => {
        const [searchParams] = useSearchParams();
        const [data, setData] = useState(null);

        const unidade = searchParams.get("unidade");
        const curso = searchParams.get("curso");

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`https://roadusp-backend.onrender.com/disciplinas?unidade=${unidade}&curso=${curso}`);
                    setData(response.data);
                } catch (error) {
                    console.error("Erro ao buscar dados do gráfico:", error);
                }
            };

            if (unidade && curso) {
                fetchData();
            }
        }, [unidade, curso]);

        return (
            <div className="GraphPage">
                <Graph data={data} />
            </div>
        );
    };

    export default GraphPage;
