"use client"

import Link from "next/link"
import React, {useState, ChangeEvent, useEffect} from "react";
import * as semver from "semver";
import {useBreakpoint} from "@/app/hooks";

const Footer = (
    <div key="footer"
        className="flex flex-col sm:flex-row justify-between max-w-screen-xl mx-auto w-full text-sm text-gray-500 dark:text-gray-300 pt-5">
        <p>A tool to help you correctly pin your dependencies according to <Link className="border-b-4"
            href="https://semver.org/">Semantic
            Versioning</Link>.</p>
        <p className="pt-2 sm:pt-0"><Link className="border-b-4" href="https://github.com/davnn/pindep">View on
            GitHub</Link>
        </p>
    </div>
)


const App: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isMobile = !useBreakpoint("sm")

    useEffect(() => {
        window.dispatchEvent(new Event("resize"));
        setIsLoading(_ => false)
    }, []);

    let range = semver.validRange(inputValue);
    let version = semver.coerce(inputValue);

    range = range !== "<0.0.0" ? range : null // this should also be an invalid range, but isn't!
    range = range ?? "*"
    version = version ?? new semver.SemVer("1.0.0")

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
    };

    const dec = (version: number) => Math.max(version - 1, 0)
    const maxCandidates = [
        new semver.SemVer(`${dec(version.major)}.${dec(version.minor)}.${dec(version.patch)}`),
        new semver.SemVer(`${version.major}.${dec(version.minor)}.${dec(version.patch)}`),
        new semver.SemVer(`${version.major}.${version.minor}.${dec(version.patch)}`),
        version
    ]
    const maxVersion = semver.maxSatisfying(maxCandidates, range) ?? semver.minVersion(range) ?? new semver.SemVer("1.0.0");
    const initial = maxVersion.version
    const patchBump = maxVersion.inc("patch").version;
    const minorBump = maxVersion.inc("minor").version;
    const majorBump = maxVersion.inc("major").version;

    const satisfyVersion = (v: string, range: string) => semver.satisfies(v, range) ? v : initial;
    const satisfyText = (v: string, range: string) => semver.satisfies(v, range) ? "↑ upgrade" : "↔ keep";
    const createItem = (v: string, range: string) => ({
        name: `If ${v} comes out:`, value: satisfyVersion(v, range), unit: satisfyText(v, range)
    })

    const data = [
        {name: "You have pinned:", value: range, unit: ""},
        createItem(patchBump, range),
        createItem(minorBump, range),
        createItem(majorBump, range),
    ]

    const component = (
        <div key="component" className="max-w-screen-xl mx-auto w-full">
            <form>
                <label htmlFor="default-search"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                    Explain
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={isMobile ? "Pin dependency (^1.0.0, ~1.0.0, ...)" : "Pin version or dependency (^1.0.0, ~1.0.0, ...)"}
                        required
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </div>
            </form>
            <p className="p-3 text-slate-500 dark:text-slate-100">Assuming that you are currently using
                version <b>{initial}</b> of a
                dependency.</p>
            <div className="dark:bg-gray-900 bg-gray-100">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 gap-px bg-white sm:grid-cols-2 lg:grid-cols-4">
                        {data.map((stat) => (
                            <div key={stat.name}
                                className="flex flex-col min-h-40 dark:bg-gray-900 bg-gray-100 px-4 py-6 sm:px-6 lg:px-8 overflow-x-hidden">
                                <p className="text-sm font-medium leading-6 dark:text-gray-400 text-gray-500 break-all">{stat.name}</p>
                                <p className="mt-2 flex items-baseline gap-x-2">
                                    <span
                                        className="text-3xl sm:text-4xl font-semibold tracking-tight dark:text-white">{stat.value}</span>
                                    {stat.unit ? <span
                                        className="text-sm dark:text-gray-400 text-gray-500">{stat.unit}</span> : null}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <main className="flex min-h-screen flex-col justify-between p-5 bg-white dark:bg-slate-800">
            {isLoading ? "" : [component, Footer]}
        </main>
    );
};


export default App;
