"use client";

import api from "@/services/api";
import Link from "next/link";
import { useCallback, useState } from "react";
import { FaBars, FaGithub, FaPlus, FaSpinner, FaTrash } from "react-icons/fa";

export default function Home() {
  const [newRepo, setNewRepo] = useState("");
  const [repositorios, setRepositorios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (e: Event) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);
        try {
          const response = await api.get(`repos/${newRepo}`);
          const data = {
            name: response.data.full_name,
          };

          setRepositorios([...repositorios, data]);
          setNewRepo("");
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }

      submit();
    },
    [newRepo, repositorios]
  );

  function handleInputChange(e: any) {
    setNewRepo(e.target.value);
  }

  const handleDelete = useCallback((repo) => {
    const find = repositorios.filter((r) => r.name !== repo);
    setRepositorios(find);
  }, []);

  return (
    <div className="max-w-2xl bg-white rounded shadow p-7 my-20 mx-auto">
      <h1 className="text-xl flex items-center">
        <FaGithub size={20} className="mr-3" />
        Meus Repositorios
      </h1>

      <form className="mt-7 flex" onSubmit={handleSubmit}>
        <input
          className="flex-1 py-2 px-3 border-solid border-2 border-[#ddd] rounded text-lg"
          type="text"
          placeholder="Adicionar Repositorios"
          value={newRepo}
          onChange={handleInputChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-primary border-none rounded ml-3 py-0 px-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <FaSpinner size={14} className="text-white animate-spin" />
          ) : (
            <FaPlus size={14} className="text-white" />
          )}
        </button>
      </form>
      <ul className="mt-5">
        {repositorios.map((repo, i) => (
          <li
            key={i}
            className="py-4 flex items-center justify-between first:border-0 border-t-[1px] border-gray-50"
          >
            <span>
              <button onClick={() => handleDelete(repo.name)} className="p-2">
                <FaTrash size={14} />
              </button>
              {repo.name}
            </span>
            <Link href={`/repositorio/${encodeURIComponent(repo.name)}`}>
              <FaBars size={20} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
