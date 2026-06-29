import type { Lang } from "./lang";

const T = {
  // Sidebar nav
  nav_pipeline:  { en: "Pipeline",     es: "Pipeline"      },
  nav_proposal:  { en: "The Proposal", es: "La Propuesta"  },
  nav_settings:  { en: "Settings",     es: "Ajustes"       },
  nav_overview:  { en: "Overview",     es: "Resumen"       },
  sign_out:      { en: "Sign out",     es: "Cerrar sesión" },

  // Partner dashboard
  dash_title:        { en: "Pipeline",           es: "Pipeline"             },
  dash_total:        { en: "Total",              es: "Total"                },
  dash_new:          { en: "New",                es: "Nuevos"               },
  dash_in_progress:  { en: "In Progress",        es: "En proceso"           },
  dash_won:          { en: "Won",                es: "Cerrados"             },
  dash_not_contacted:{ en: "Not contacted",      es: "Sin contacto"         },
  dash_at_risk:      { en: "At risk",            es: "En riesgo"            },
  dash_avg_response: { en: "Avg response",       es: "Resp. media"          },
  dash_no_leads:     { en: "No leads assigned yet",   es: "Sin leads asignados"   },
  dash_no_leads_sub: { en: "Leads from your campaign will appear here", es: "Los leads de tu campaña aparecerán aquí" },
  dash_total_leads:  { en: "total leads",        es: "leads en total"       },

  // Lead list filters / table
  leads_filter_all:        { en: "All",         es: "Todos"         },
  leads_filter_new:        { en: "New",         es: "Nuevos"        },
  leads_filter_screening:  { en: "Screening",   es: "Evaluación"    },
  leads_filter_qualified:  { en: "Qualified",   es: "Calificados"   },
  leads_filter_matched:    { en: "Matched",     es: "Emparejados"   },
  leads_filter_in_progress:{ en: "In Progress", es: "En proceso"    },
  leads_filter_won:        { en: "Won",         es: "Cerrados"      },
  leads_filter_lost:       { en: "Lost",        es: "Perdidos"      },
  leads_col_name:          { en: "Name",        es: "Nombre"        },
  leads_col_email:         { en: "Email",       es: "Email"         },
  leads_col_phone:         { en: "Phone",       es: "Teléfono"      },
  leads_col_status:        { en: "Status",      es: "Estado"        },
  leads_col_contact:       { en: "Contact",     es: "Contacto"      },
  leads_col_date:          { en: "Date",        es: "Fecha"         },
  leads_none:              { en: "No leads with this status.", es: "Sin leads con este estado." },
  leads_prev:              { en: "Previous",    es: "Anterior"      },
  leads_next:              { en: "Next",        es: "Siguiente"     },
  leads_not_contacted:     { en: "Not contacted", es: "Sin contacto" },
  leads_at_risk:           { en: "At risk",     es: "En riesgo"     },

  // Lead detail page
  lead_back:           { en: "← Pipeline",         es: "← Pipeline"         },
  lead_buyer_profile:  { en: "Buyer Profile",       es: "Perfil del comprador" },
  lead_app_data:       { en: "Application Data",    es: "Datos de solicitud"  },
  lead_notes:          { en: "Lead Notes",          es: "Notas del lead"      },
  lead_restricted:     { en: "Full profile details are restricted for this assignment.", es: "El perfil completo está restringido para esta asignación." },
  lead_log_contact:    { en: "Log Contact",         es: "Registrar contacto"  },
  lead_log_desc:       { en: "Records your outreach so response time is tracked.", es: "Registra tu contacto para medir el tiempo de respuesta." },
  lead_add_note:       { en: "Add Note",            es: "Añadir nota"         },
  lead_activity:       { en: "Activity",            es: "Actividad"           },
  lead_no_activity:    { en: "No activity yet.",    es: "Sin actividad aún."  },
  lead_note_placeholder: { en: "Add a note...",     es: "Añadir una nota..."  },
  lead_saving:         { en: "Saving...",           es: "Guardando..."        },
  lead_add_note_btn:   { en: "Add Note",            es: "Añadir nota"         },
  lead_log_btn:        { en: "Log contact",         es: "Registrar"           },
  lead_logged:         { en: "Logged ✓",           es: "Registrado ✓"        },
  lead_logging:        { en: "Logging...",          es: "Registrando..."      },
  lead_schedule:       { en: "Schedule a Conversation", es: "Agendar una conversación" },
  lead_schedule_sub:   { en: "30 minutes. No obligation.", es: "30 minutos. Sin compromiso." },

  // Settings
  settings_title:      { en: "Settings",           es: "Ajustes"             },
  settings_subtitle:   { en: "Manage your profile and account", es: "Gestiona tu perfil y cuenta" },
  settings_profile:    { en: "Profile",             es: "Perfil"              },
  settings_email:      { en: "Email",               es: "Email"               },
  settings_name:       { en: "Full Name",           es: "Nombre completo"     },
  settings_phone:      { en: "Phone",               es: "Teléfono"            },
  settings_company:    { en: "Company",             es: "Empresa"             },
  settings_save:       { en: "Save Changes",        es: "Guardar cambios"     },
  settings_saving:     { en: "Saving...",           es: "Guardando..."        },
  settings_saved:      { en: "Profile updated.",    es: "Perfil actualizado." },
  settings_password:   { en: "Change Password",     es: "Cambiar contraseña"  },
  settings_new_pass:   { en: "New Password",        es: "Nueva contraseña"    },
  settings_confirm_pass: { en: "Confirm Password",  es: "Confirmar contraseña" },
  settings_pass_min:   { en: "Minimum 8 characters", es: "Mínimo 8 caracteres" },
  settings_confirm:    { en: "Confirm",             es: "Confirmar"           },
  settings_update_pass:{ en: "Update Password",     es: "Actualizar contraseña" },
  settings_updating:   { en: "Updating...",         es: "Actualizando..."     },
  settings_pass_updated:{ en: "Password updated.",  es: "Contraseña actualizada." },
  settings_pass_mismatch:{ en: "Passwords do not match.", es: "Las contraseñas no coinciden." },
  settings_account:    { en: "Account",             es: "Cuenta"              },
  settings_role:       { en: "Role",                es: "Rol"                 },
  settings_status:     { en: "Status",              es: "Estado"              },
  settings_member_since:{ en: "Member since",       es: "Miembro desde"       },

  // Status badge values
  status_new:          { en: "new",        es: "nuevo"      },
  status_screening:    { en: "screening",  es: "evaluación" },
  status_qualified:    { en: "qualified",  es: "calificado" },
  status_matched:      { en: "matched",    es: "emparejado" },
  status_in_progress:  { en: "in progress",es: "en proceso" },
  status_won:          { en: "won",        es: "cerrado"    },
  status_lost:         { en: "lost",       es: "perdido"    },
  status_archived:     { en: "archived",   es: "archivado"  },
};

export type TKey = keyof typeof T;

export function t(key: TKey, lang: Lang): string {
  return T[key][lang];
}
