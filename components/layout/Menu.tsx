import Link from "next/link";
import { useEffect, useState } from "react";
import menuData from "@/data/menu.json";
import { getMenuIconByName } from "../utils/MenuIcons";

interface MenuItem {
  _id: string;
  name: string;
  link: string;
  order: number;
}

interface DropdownChild {
  _id: string;
  title: string;
  link: string;
  order: number;
}

interface DropdownMenu {
  _id: string;
  title: string;
  children: DropdownChild[];
  order: number;
}

interface MenuProps {
  menuItems?: MenuItem[];
  dropdownMenus?: DropdownMenu[];
}

export default function Menu({ menuItems = [], dropdownMenus = [] }: MenuProps) {
  const [data, setData] = useState<any>(
    menuItems.length > 0 ? menuItems : menuData.mainMenuItems || []
  );

  useEffect(() => {
    if (menuItems) {
      // If menuItems is provided, use it
      setData(menuItems);
    } else {
      // Otherwise use the default menu data
      setData(menuData.mainMenuItems);
    }
  }, [menuItems]);

  // If using simple menu items format (from header editor)
  if (menuItems) {
    return (
      <div className="d-none d-lg-flex">
        <ul className="navbar-nav mx-auto" style={{ gap: '0.125rem' }}>
          {(data?.map((item: MenuItem) => (
            <li key={item._id || `menu-item-${item.name}`} className="nav-item">
              <Link
                className="nav-link fw-bold d-flex align-items-center fs-7"
                href={item.link || "#"}
              >
                {item.name}
              </Link>
            </li>
          ))) || []}
          
          {/* Dropdown Menus */}
          {dropdownMenus?.map((dropdown: DropdownMenu) => (
            <li key={dropdown._id} className="nav-item dropdown">
              <Link
                className="nav-link fw-bold d-flex align-items-center dropdown-toggle fs-7"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {dropdown.title}
              </Link>
              <ul className="dropdown-menu">
                {dropdown.children?.map((child: DropdownChild) => (
                  <li key={child._id}>
                    <Link
                      className="dropdown-item"
                      href={child.link || "#"}
                    >
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // If using complex menu items format (from menu.json)
  return (
    <>
      <div className="d-none d-lg-flex">
        <ul className="navbar-nav mx-auto" style={{ gap: '0.125rem' }}>
          {data?.map((item: any, index: number) => (
            <li
              key={`menu-item-${item?.title || index}`}
              className={`nav-item ${
                item?.dropdown ? `dropdown ${item?.dropdownType}` : ""
              }`}
            >
              <Link
                className="nav-link fw-bold d-flex align-items-center fs-7"
                href={item?.href || "#"}
                role={item?.dropdown ? "button" : undefined}
                data-bs-toggle={item?.dropdown ? "dropdown" : undefined}
                aria-expanded={item?.dropdown ? "false" : undefined}
              >
                {item?.title || ""}
              </Link>

              {item?.dropdown &&
                item?.dropdownType === "menu-item-has-children" && (
                  <div className="dropdown-menu fix">
                    <ul className="list-unstyled">
                      {item?.dropdownItems?.map(
                        (dropdownItem: any, i: number) => (
                          <li
                            key={`dropdown-item-${i}-${dropdownItem?.title || i}`}
                            className="position-relative z-1 border-bottom"
                          >
                            <Link
                              className="dropdown-item position-relative z-1 d-flex align-items-start"
                              href={dropdownItem?.href || "#"}
                            >
                              {dropdownItem?.icon &&
                                getMenuIconByName(dropdownItem.icon)}
                              <span className="ms-2">
                                <span className="d-block fw-bold fs-7">
                                  {dropdownItem?.title || ""}
                                </span>
                                {dropdownItem?.subtitle && (
                                  <span className="text-600 fs-7">
                                    {dropdownItem.subtitle}
                                  </span>
                                )}
                              </span>
                            </Link>
                          </li>
                        )
                      ) || []}
                    </ul>
                    <div className="ellipse-rotate-success-sm position-absolute top-0 start-0 translate-middle z-0" />
                    <div className="ellipse-rotate-primary-sm position-absolute top-50 z-0" />
                  </div>
                )}

              {item?.dropdown && item?.dropdownType === "has-mega-menu" && (
                <div className="mega-menu fix start-50 translate-middle-x">
                  <div className="container">
                    <div className="row">
                      <div className="col-12">
                        <div className="mega-menu-content">
                          <div className="row">
                            {item?.megaMenuSections?.map(
                              (section: any, sectionIndex: number) => (
                                <div key={`mega-section-${sectionIndex}-${section?.title || sectionIndex}`} className="col-2">
                                  <div className="mega-menu-list">
                                    <p className="text-primary fw-bold mb-1 fs-7">
                                      {section?.title || ""}
                                    </p>
                                    <ul className="list-unstyled">
                                      {section?.links?.map(
                                        (link: any, linkIndex: number) => (
                                          <li key={`mega-link-${sectionIndex}-${linkIndex}-${link?.title || linkIndex}`}>
                                            <Link
                                              className="dropdown-item position-relative z-1"
                                              href={link?.href || "#"}
                                            >
                                              {link?.title || ""}
                                            </Link>
                                          </li>
                                        )
                                      ) || []}
                                    </ul>
                                  </div>
                                </div>
                              )
                            ) || []}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="position-absolute top-0 start-50 translate-middle-x z-0">
                    <img src="/assets/imgs/team-1/bg-line.png" alt="infinia" />
                  </div>
                  <div className="ellipse-rotate-success-sm position-absolute top-0 start-0 translate-middle z-0" />
                  <div className="ellipse-rotate-primary-sm position-absolute top-0 end-0 translate-middle-y z-0" />
                </div>
              )}

              {item?.dropdown && item?.dropdownType === "has-mega-menu-2" && (
                <div className="mega-menu fix">
                  <div className="d-flex flex-wrap gap-2 position-relative z-1">
                    {item?.sections?.map((section: any, i: number) => (
                      <Link
                        key={`section-${i}-${section?.title || i}`}
                        href={section?.href || "#"}
                        className="btn btn-md btn-filter mb-2 me-2 rounded-pill py-2 d-inline-flex"
                      >
                        {section?.title || ""}
                        <span className="rounded-pill ms-2 fs-9 bg-primary-soft text-dark px-2 py-1">
                          {section?.count || "0"}
                        </span>
                      </Link>
                    )) || []}
                  </div>
                  <div className="position-absolute bottom-0 end-0 z-0">
                    <img src="/assets/imgs/other/bg-line.png" alt="infinia" />
                  </div>
                  <div className="ellipse-rotate-success-sm position-absolute top-0 start-0 translate-middle z-0" />
                </div>
              )}
            </li>
          )) || []}
        </ul>
      </div>
    </>
  );
}
