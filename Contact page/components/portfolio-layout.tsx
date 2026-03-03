"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { PROJECTS } from "@/lib/project-data"
import { ContactForm } from "./contact-form"

export const PortfolioLayout = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#fafafa]">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {PROJECTS.map((project) => (
          <Link
            key={project.id}
            href={`/work/${project.id}`}
            className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
          >
            <div className="relative overflow-hidden">
              <img
                src={project.heroImage || "/placeholder.svg"}
                alt={project.title}
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#191775] via-[#191775]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-xl md:text-2xl font-medium">{project.title}</span>
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:-rotate-45" />
                </div>
                <span className="text-xl md:text-2xl text-white font-light">{project.year}</span>
              </div>
            </div>
          </Link>
        ))}

        <div className="max-w-[800px] mx-auto pt-12">
          <ContactForm />

          {/* Footer Logo Section */}
          <motion.div
            className="w-full pt-24 pb-12 flex justify-center items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
          >
            <div className="text-[120px] font-bold text-black tracking-tighter select-none">VESSEL</div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
