import * as React from "react";
import Link from "../Link";

const CVItem: React.FC<{
  title: React.ReactNode;
  details: React.ReactNode;
  active?: boolean;
  orgUrl?: string;
  children?: React.ReactNode;
}> = ({ title, details, active = false, orgUrl = null, children }) => (
  <div
    className={`px-6 py-6 border-2 ${
      active
        ? "border-gray-800 dark:border-gray-200"
        : "border-gray-300 dark:border-gray-700"
    }`}
  >
    {orgUrl !== null ? (
      <a href={orgUrl} target="_blank" rel="noopener noreferrer">
        <h3 className="mb-1 text-3xl text-gray-800 leading-tight transition dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400">
          {title}
        </h3>
      </a>
    ) : (
      <h3 className="mb-1 text-3xl text-gray-800 leading-tight dark:text-gray-200">
        {title}
      </h3>
    )}

    <span className="block mb-4 text-gray-800 dark:text-gray-300">
      {details}
    </span>
    <div className="leading-relaxed text-gray-800 dark:text-gray-300">
      {children}
    </div>
  </div>
);

const Tags: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4 flex flex-wrap gap-1">{children}</div>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="px-2 py-1 bg-gray-800 text-white text-xs rounded dark:bg-gray-700 dark:text-white">
    {children}
  </span>
);

const Resume: React.FC = () => (
  <>
    <div className="flex flex-col gap-5">
      <CVItem
        title="ASU Preparatory Academy"
        orgUrl="https://asuprep.asu.edu"
        details={
          <>
            <span className="whitespace-nowrap">Lead Developer &middot;</span>{" "}
            <span className="whitespace-nowrap">Contract &middot;</span>{" "}
            <span className="whitespace-nowrap">Dec 2022 &mdash; current</span>
          </>
        }
        active={true}
      >
        <Tags>
          <Tag>JavaScript</Tag>
          <Tag>TypeScript</Tag>
          <Tag>Node.js</Tag>
          <Tag>React</Tag>
          <Tag>Next.js</Tag>
          <Tag>Docker</Tag>
          <Tag>MongoDB</Tag>
        </Tags>
      </CVItem>
      <CVItem
        title="Konbini"
        details={
          <>
            <span className="whitespace-nowrap">Founder &middot;</span>{" "}
            <span className="whitespace-nowrap">Dec 2021 &mdash; Nov 2022</span>
          </>
        }
      >
        <Tags>
          <Tag>JavaScript</Tag>
          <Tag>TypeScript</Tag>
          <Tag>Node.js</Tag>
          <Tag>Google Cloud</Tag>
          <Tag>React</Tag>
          <Tag>Next.js</Tag>
          <Tag>Docker</Tag>
          <Tag>GraphQL</Tag>
        </Tags>
      </CVItem>
      <CVItem
        title="DataCamp"
        orgUrl="https://www.datacamp.com/"
        details={
          <>
            <span className="whitespace-nowrap">
              Software Engineer &middot;
            </span>{" "}
            <span className="whitespace-nowrap">Contract &middot;</span>{" "}
            <span className="whitespace-nowrap">Aug 2021 &mdash; Feb 2022</span>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p>
            I worked with DataCamp for about six months on a contract basis,
            writing mostly frontend code with TypeScript, React and Next.js.
            During this time, I worked with their existing team to help maintain
            and iterate on their public-facing web properties (i.e. everything
            on <Link href="https://www.datacamp.com/">datacamp.com</Link>
            ).
          </p>
          <p>
            This included communication with stakeholders, code reviews,
            managing the software development process using Jira and GitHub, as
            well as implementing designs built in Figma by the design team.
          </p>
        </div>
        <Tags>
          <Tag>JavaScript</Tag>
          <Tag>TypeScript</Tag>
          <Tag>React</Tag>
          <Tag>Next.js</Tag>
          <Tag>Docker</Tag>
          <Tag>GraphQL</Tag>
        </Tags>
      </CVItem>
      <CVItem
        title="Infostud"
        orgUrl="https://www.infostud.com/en/"
        details={
          <>
            <span className="whitespace-nowrap">
              Software Engineer &middot;
            </span>{" "}
            <span className="whitespace-nowrap">Full-time &middot;</span>{" "}
            <span className="whitespace-nowrap">2017 &mdash; 2021</span>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p>
            At Infostud, I had the opportunity to work at one of the largest
            internet companies in Serbia, contributed to the development of
            greenfield projects across the entire stack, and was occasionally
            responsible for maintenance of legacy code, as part of the team(s)
            behind{" "}
            <Link href="https://poslovi.infostud.com/">Poslovi Infostud</Link>{" "}
            and <Link href="https://www.hrlab.rs/en">HR Lab</Link> &mdash; the
            leading platforms for job seekers and employers in Serbia.
          </p>
          <p>
            Tech-wise, I mainly worked with PHP and JavaScript/TypeScript, and
            deployed (non-legacy) code as container images to an internal
            Kubernetes cluster.
          </p>
          <p>Some of the things I did in my time at Infostud include:</p>
          <ul className="cv-item-bullets flex flex-col gap-3">
            <li>
              Worked on the rewrite of Infostud's ATS product (now{" "}
              <Link href="https://www.hrlab.rs/en/hr-lab-asistent">
                HR Lab Assistant
              </Link>
              ) using modern tech like PHP &gt;= 7, React, GraphQL, Docker, and
              Kubernetes. As of 2021, HR Lab Assistant was the most widely-used
              ATS software in Serbia.
            </li>
            <li>
              Built an internal payment platform that integrated with PayPal and
              NestPay (a proprietary payment gateway popular in the region) to
              enable HR Lab products to easily integrate credit card payments
              and other payment methods. When I was at Infostud, tens of
              thousands of dollars worth of payments passed through this system
              every month.
            </li>
            <li>
              Maintained{" "}
              <Link href="https://poslovi.infostud.com/">
                poslovi.infostud.com
              </Link>
              , the leading job board in Serbia, with over 1 million monthly
              unique users.
            </li>
            <li>
              Built the then-current iteration of{" "}
              <Link href="https://www.hrlab.rs/en/">HRLab.rs</Link>, the website
              for the HR Lab brand, using React and Gatsby, improving site
              performance by 300% in the process. I also later migrated this
              site from Gatsby to Next.js, quickly enough that we didn't need to
              institute a feature freeze.
            </li>
            <li>
              Built CI/CD pipelines for the team's codebases using GitLab CI/CD,
              Docker, Kubernetes, and Helm.
            </li>
            <li>
              Built an OAuth 2.0 identity provider for the HR Lab platform,
              allowing HR Lab products to easily authenticate users through a
              central location.
            </li>
          </ul>
        </div>
        <Tags>
          <Tag>PHP</Tag>
          <Tag>JavaScript</Tag>
          <Tag>TypeScript</Tag>
          <Tag>Symfony</Tag>
          <Tag>React</Tag>
          <Tag>Docker</Tag>
          <Tag>Kubernetes</Tag>
          <Tag>GraphQL</Tag>
          <Tag>Next.js</Tag>
        </Tags>
      </CVItem>
      <CVItem
        title="Sol Press"
        details={
          <>
            <span className="whitespace-nowrap">
              Software Engineer &middot;
            </span>{" "}
            <span className="whitespace-nowrap">Contract &middot;</span>{" "}
            <span className="whitespace-nowrap">2017 &mdash; 2020</span>
          </>
        }
      >
        <div>
          I worked on various projects for Sol Press -- a now-defunct US-based
          localization and publishing company -- over the course of a few years,
          doing everything from one-off scripts to web development and server
          administration, and largely being responsible for building their Web
          presence from scratch.
        </div>
        <Tags>
          <Tag>PHP</Tag>
          <Tag>JavaScript</Tag>
          <Tag>Vue.js</Tag>
          <Tag>Laravel</Tag>
          <Tag>Nuxt.js</Tag>
          <Tag>WordPress</Tag>
          <Tag>Linux</Tag>
        </Tags>
      </CVItem>
      <CVItem
        title="Execom"
        orgUrl="https://htecgroup.com/"
        details={
          <>
            <span className="whitespace-nowrap">Intern &middot;</span>{" "}
            <span className="whitespace-nowrap">Mar 2017 &mdash; Apr 2017</span>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p>
            (Note: Execom was merged into{" "}
            <Link href="https://htecgroup.com/">HTEC Group</Link> after my time
            there.)
          </p>
          <p>
            I interned at Execom for about a month to fulfill a college
            requirement. While I was there, I was given multiple small
            full-stack and frontend projects to build by myself, using tech like
            PHP and AngularJS.
          </p>
        </div>
        <Tags>
          <Tag>PHP</Tag>
          <Tag>JavaScript</Tag>
          <Tag>Symfony</Tag>
          <Tag>AngularJS</Tag>
        </Tags>
      </CVItem>
    </div>
  </>
);

export default Resume;
