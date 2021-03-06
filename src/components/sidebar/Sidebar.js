import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import Bio from "./Bio"
import "./sidebar.css"

import TechTags from "./TechTags"

const Sidebar = () => {
  return (
    <StaticQuery
      query={graphql`
        query SiteBioQuery {
          site {
            siteMetadata {
              title
              tagline
              author
              labels {
                tag
                tech
                name
                size
                color
              }
            }
          }
          allMarkdownRemark(
            limit: 10
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { published: { eq: true } } }
          ) {
            edges {
              node {
                frontmatter {
                  tags
                }
              }
            }
          }
        }
      `}
      render={data => (
        <>
          <div className="sidebar-main border-right">
            <Bio
              author={data.site.siteMetadata.author}
              tagline={data.site.siteMetadata.tagline}
            />
            <div className="page-links">
              <Link to="/">
                <span className="d-block py-1 link-dark">Blog Home</span>
              </Link>
              <Link to="/projects">
                <span className="d-block py-1 link-dark">Projects</span>
              </Link>
              <Link to="/archive">
                <span className="d-block py-1 link-dark">Archive</span>
              </Link>
            </div>
            <div className="tech-tags mt-4">
              <TechTags
                labels={data.site.siteMetadata.labels}
                posts={data.allMarkdownRemark.edges}
              />
            </div>
          </div>
        </>
      )}
    />
  )
}

export default Sidebar
