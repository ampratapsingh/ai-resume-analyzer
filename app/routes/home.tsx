import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "../components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "NextHire" },
    { name: "description", content: "Smart Feedback for your next job!" },
  ];
}

export default function Home() {
  const {auth, kv} = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoadingResumes, setLoadingResumes] = useState(false);
  
    useEffect(() => {
      if(!auth.isAuthenticated) {
        navigate('/auth?next=/');
      }
    },[auth.isAuthenticated]);

    useEffect(() => {
      const loadResumes = async () => {
        setLoadingResumes(true);
        const resumes = (await kv.list('resumes:*', true)) as KVItem[];
        const parsedResumes = resumes?.map((resume) => {
          return JSON.parse(resume.value) as Resume;
        })

        console.log("parsedResumes", parsedResumes);
        setResumes(parsedResumes || []);
        setLoadingResumes(false);
      }
      loadResumes();
    },[])

   

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

       <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Applications & Resume Ratings</h1>
        {!isLoadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
        ): (
          <h2>Review your submissions and check AI-powered feedback.</h2>
        )}
      </div>
      {isLoadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
      )}

      {!isLoadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}

      {!isLoadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}
    </section>
    </main>
  );
}
