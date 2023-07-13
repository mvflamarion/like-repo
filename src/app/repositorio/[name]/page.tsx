"use client";

import api from "@/services/api";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

function Repositorio({ params }: { params: { name: string } }) {
  const [repositorio, setRepositorio] = useState({});
  const [issue, setIssue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [stateIssue, setStateIssue] = useState("all");

  useEffect(() => {
    async function load() {
      const nomeRepo = decodeURIComponent(params.name);

      const [repositorioData, issueData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: stateIssue,
            per_page: 5,
          },
        }),
      ]);

      setRepositorio(repositorioData.data);
      setIssue(issueData.data);
      setLoading(false);
    }

    load();
  }, [params.name]);

  useEffect(() => {
    async function loadIssue() {
      const nomeRepo = decodeURIComponent(params.name);

      const response = await api.get(`/repos/${nomeRepo}/issues`, {
        params: {
          state: stateIssue,
          per_page: 5,
          page,
        },
      });

      setIssue(response.data);
    }
    loadIssue();
  }, [params.name, page, stateIssue]);

  function handlePage(action) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

  function handleStateIssue(state) {
    setStateIssue(state);
  }

  if (loading) {
    return;
  }

  return (
    <div className="max-w-3xl bg-white rounded shadow-md p-7 my-20 mx-auto">
      <Link href={`/`}>
        <FaArrowLeft size={30} />
      </Link>
      <div className="flex flex-col items-center">
        <Image
          src={repositorio.owner.avatar_url}
          alt={repositorio.owner.login}
          width={150}
          height={150}
          className="rounded-sm my-5"
        />
        <h1 className="text-3xl text-primary">{repositorio.name}</h1>
        <p className="mt-1 text-sm text-black text-center max-w-xs">
          {repositorio.description}
        </p>
      </div>

      <div className="flex text-xs gap-1 m-4">
        <button
          type="button"
          onClick={() => handleStateIssue("all")}
          disabled={stateIssue === "all"}
          className="rounded-md bg-gray-600 text-white py-1 px-2 disabled:bg-[#0071db]"
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => handleStateIssue("open")}
          disabled={stateIssue === "open"}
          className="rounded-md bg-gray-600 text-white py-1 px-2 disabled:bg-[#0071db]"
        >
          Abertas
        </button>
        <button
          type="button"
          onClick={() => handleStateIssue("closed")}
          disabled={stateIssue === "closed"}
          className="rounded-md bg-gray-600 text-white py-1 px-2 disabled:bg-[#0071db]"
        >
          Fechadas
        </button>
      </div>

      <ul className="mt-7 pt-7 border-t border-gray-200">
        {issue?.map((issue) => (
          <li key={String(issue.id)} className="flex py-4 px-3 first:mt-0 mt-3">
            <Image
              width={50}
              height={50}
              src={issue.user.avatar_url}
              alt={issue.user.login}
              className="rounded-[50%] border-2 border-primary"
            />
            <div className="flex-1 ml-3">
              <strong className="text-sm">
                <Link
                  href={issue.html_url}
                  className="hover:text-[#0071db] duration-300 text-gray-800"
                >
                  {issue.title}
                </Link>
                {issue.labels.map((label) => (
                  <span
                    key={String(label.id)}
                    className="text-xs font-semibold bg-gray-900 text-white rounded-md py-1 px-2 ml-2"
                  >
                    {label.name}
                  </span>
                ))}
              </strong>

              <p className="mt-3 text-xs text-black">{issue.user.login}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => handlePage("back")}
          disabled={page < 2}
          className="bg-gray-900 text-white py-1 px-2 rounded-md disabled:cursor-not-allowed disabled:opacity-5"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={() => handlePage("next")}
          className="bg-gray-900 text-white py-1 px-2 rounded-md"
        >
          Proxima
        </button>
      </div>
    </div>
  );
}

export default Repositorio;
