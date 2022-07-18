(function() {
    const pgs_thresh = {
      "S1": 5e-08,
      "S2": 1e-07,
      "S3": 1e-06,
      "S4": 1e-05,
      "S5": 1e-04,
      "S6": 0.001,
      "S7": 0.01,
      "S8": 0.05,
      "S9": 0.1,
      "S10": 0.2,
      "S11": 0.5,
      "S12": 1
    };
    
    for(var s in pgs_thresh){  
      e_check_div = document.createElement("div");
      e_check_div.classList = "p-2 custom-control checkbox checkbox-info custom-checkbox custom-control-inline";
      e_check_div.setAttribute("data-toggle", "tooltip");
      e_check_div.setAttribute("title", `p-threshold: ${pgs_thresh[s]}`);
      e_check = document.createElement("input");
      e_check.classList = "custom-control-input checkbox-styled";
      e_check.type = "checkbox";
      e_check_lab = document.createElement("label");
      e_check_lab.classList = "m-2 custom-control-label";
      e_check.label = s;
      e_check.id = s
      e_check.name = "s-checkbox";
      e_check.value = s;
      e_check.addEventListener("change", update_urls, false)
      e_check_lab.classList = "pr-2";
      e_check_lab.innerHTML = s;
      e_check_lab.setAttribute("for", s);

      default_checked = ["S7"];
      if(default_checked.includes(s)){
        e_check.checked = true;
      }
      document.getElementById("s-selector").appendChild(e_check_div);
      e_check_div.appendChild(e_check);
      e_check_div.appendChild(e_check_lab);
    }
  })();

  function update_urls() {
    const checkboxes = document.querySelectorAll(`input[name="s-checkbox"]:checked`);
    let values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value);
    });
    if (values.length === 0) { 
      alert("At least one threshold must be chosen.");
      document.getElementById("S7").checked = true;
      values = "S7";
    }
    const links = document.querySelectorAll(`a[name="links"]`);
    links.forEach((link) => {
      l_url = link.getAttribute("href");
      var qstring = l_url.substring(l_url.indexOf('?'), l_url.lastIndexOf("/"));
      qstring = qstring.substring(qstring.lastIndexOf('&'), qstring.lastIndexOf("/"));
      var clean_url = l_url.substring(0, l_url.indexOf('?'));
      var new_url = `${clean_url}${qstring}&slevel=${values.toString()}/`;
      link.setAttribute("href", new_url);
    });
  }


  
  (async function() {
    const r = await fetch("./cgi/get_pgslist_json.cgi");
    if (!r.ok) {
      throw r.statusText();
    }
    const pgs_json = await r.json();
    e_pgs = document.getElementById("pgsIds");
    for(id in pgs_json){
      e_card = document.createElement("div");
      e_card.classList = "accordion-item";
      e_pgs.appendChild(e_card);
      e_card_head = document.createElement("h2");
      e_card_head.classList = "accordion-header";
      e_card_head.id = `heading-${id}`;
      e_card.appendChild(e_card_head);

      e_card_button = document.createElement("button");
      e_card_button.innerHTML = pgs_json[id]["title"];
      e_card_button.classList = "accordion-button";
      e_card_button.type = "button";
      e_card_button.setAttribute('data-bs-toggle', 'collapse');
      e_card_button.setAttribute('data-bs-target', `#collapse-${id}`);
      e_card_button.setAttribute('aria-controls', `collapse-${id}`);
      e_card_head.appendChild(e_card_button);

      e_card_collapse = document.createElement("div");          
      e_card_collapse.classList = "collapse mt-4";
      e_card_collapse.id = `collapse-${id}`;
      e_card_collapse.setAttribute("aria-labelledby", `heading-${id}`);
      e_card_collapse.setAttribute("data-parent", `pgsIds`);
      e_card.appendChild(e_card_collapse);
        e_card_button.setAttribute('aria-expanded', 'false');
        e_card_button.classList.add("collapsed");
      e_card_body = document.createElement("div");
      e_card_body.classList = "accordion-body";
      e_card_collapse.appendChild(e_card_body);
      e_card_text = document.createElement("p");
      e_card_text.innerHTML = pgs_json[id]["reference"];
      e_card_body.appendChild(e_card_text);
       // table
      e_card_pgs_table = document.createElement("table");
      e_card_pgs_table.classList = "table table-hover table-dark table-striped table-sm";
      e_card_pgs_table_body = document.createElement("tbody");
      e_card_pgs_table_head = document.createElement("thead");
      e_card_pgs_table_head_tr = document.createElement("tr");
      e_card_pgs_table_head.appendChild(e_card_pgs_table_head_tr);
      e_card_pgs_table.appendChild(e_card_pgs_table_head);
      e_card_pgs_table.appendChild(e_card_pgs_table_body);
      e_card_body.appendChild(e_card_pgs_table);

      e_card_p = document.createElement("p");
      e_card_p.classList = "text-right";
      e_card_upd = document.createElement("small");
      e_card_upd.classList = "text-muted text-right";
      e_card_upd.innerHTML = `Last updated: ${pgs_json[id]["updated"]}`;
      e_card_p.appendChild(e_card_upd);
      e_card_body.appendChild(e_card_p);

      // add table with pgs within each card
      const tabl_heads = ["select", "short", "covariates"];
      tabl_heads.forEach(heads => {
        e_card_pgs_table_head_th = document.createElement("th");
        e_card_pgs_table_head_th.setAttribute("scope", "col");
        e_card_pgs_table_head_th.classList = "th-sm";
        e_card_pgs_table_head_th.innerHTML = heads;
        e_card_pgs_table_head_tr.appendChild(e_card_pgs_table_head_th);
      })
      for(pgs in pgs_json[id]["pgs"]){
        e_card_pgs_row   = document.createElement("tr");
       // check
        e_card_pgs_check = document.createElement("td");
        e_card_pgs_check.classList = "text-center";
        e_card_pgs_check_d = document.createElement("div");
        e_card_pgs_check_d.classList = "custom-control custom-checkbox";
        e_card_pgs_check.appendChild(e_card_pgs_check_d);
        e_card_pgs_check_input = document.createElement("input");
        e_card_pgs_check_input.type = "checkbox";
        e_card_pgs_check_input.classList = "custom-control-input";
        e_card_pgs_check_input.id = `tab-check-${id}-${pgs}`;
        e_card_pgs_check_input.name = id;
        e_card_pgs_check_input.value = pgs;
        e_card_pgs_check_lab = document.createElement("label");
        e_card_pgs_check.appendChild(e_card_pgs_check_input);
        e_card_pgs_row.appendChild(e_card_pgs_check);
        // short name
        e_card_pgs_short = document.createElement("td");
        e_card_pgs_short.setAttribute("data-toggle", "tooltip");
        e_card_pgs_short.setAttribute("title", pgs_json[id]["pgs"][pgs]["title"]);
        e_card_pgs_row.appendChild(e_card_pgs_short);
        e_card_pgs_a =  document.createElement("a");
        e_card_pgs_a.name = "links";
        e_card_pgs_a.classList = "text-default";
        e_card_pgs_a.href = `./cgi/get_pgsfile_tsv.cgi?=id=${encodeURI(id)}&pgs=${encodeURI(pgs)}&slevel=S7/`;
        update_urls();
        e_card_pgs_a.download = `noas_${id}_${pgs}_${pgs_json[id]["updated"]}.tsv`;
        e_card_pgs_a.innerHTML = pgs;
        e_card_pgs_short.appendChild(e_card_pgs_a);
        // covars
        e_card_pgs_covariates = document.createElement("td");
        e_card_pgs_covariates.innerHTML = pgs_json[id]["pgs"][pgs]["covariates"].join(", ");
        e_card_pgs_row.appendChild(e_card_pgs_covariates);
        e_card_pgs_table_body.appendChild(e_card_pgs_row);
      }
    };
  })();

function construct_query_string(){
  const e_slevels = document.querySelectorAll(`input[name="s-checkbox"]:checked`);
  let slevels = [];
  e_slevels.forEach((e_slevels) => {
      slevels.push(e_slevels.value);
  });
  slevels = slevels.join(",")
  const checked = document.querySelectorAll(`[id^="tab-check-"]:checked`);
  var querystring = [];
  checked.forEach(sel => {
      querystring = querystring.concat(`id=${sel.name}&pgs=${sel.value}&slevel=${slevels}`);
  });
  return querystring.join("&&");
}

async function get_selected(){
    var querystring = construct_query_string();
    getstr = `./cgi/get_pgsfile_tsv.cgi?=${querystring}/`;
    content = await fetch(getstr)
}

function create_r_script(){
  var querystring = construct_query_string();
  var r_script = `
  pgs_noas <- ({
    read.delim(
      text = system2("curl", 
                "-X GET 'http://localhost:7891/cgi/get_pgsfile_tsv.cgi?=${querystring}'", 
                stdout = TRUE),
      stringsAsFactors = FALSE
    )
  })`
  ep = document.createElement("p");
  ep.innerHTML = "For best result in merging NOAS data and this data, use <code>dlyr::left_join(d_noas, pgs_noas)</code>";
  display_modal("R script for selection", 
    body = ep,
    type = null,
    footer = create_modal_code(r_script));
  console.log(r_script)
}

function create_bash_script(){
  var querystring = construct_query_string();
  var bash_script = `curl -X GET 'http://localhost:7891/cgi/get_pgsfile_tsv.cgi?=${querystring}'`
  ep = document.createElement("p");
  ep.innerHTML = "The script will execute a cURL request to retrieve data, and provide back a tab separated text. Save this to a file or the like to work with."
  display_modal("bash script for selection", 
    body = ep,
    type = null,
    footer = create_modal_code(bash_script));
}


// modals

function display_modal(title, body=null, type=null, footer=null){
  mod = document.getElementById("modal");
  mod.innerHTML = "";
  mod_diag = document.createElement("div");
  mod_diag.classList = "modal-dialog";
  mod_diag.setAttribute("role", "document");
  mod.appendChild(mod_diag);
  mod_cont = document.createElement("div");
  mod_cont.classList = "modal-content";
  mod_diag.appendChild(mod_cont);
  mod_head = document.createElement("div");
  mod_head.classList = "modal-header";
  mod_cont.appendChild(mod_head);
  mod_h4 = document.createElement("h4");
  mod_h4.id = "edit-selection";
  mod_h4.innerHTML = title;
  mod_h4.setAttribute("value", title);
  mod_head.appendChild(mod_h4);
  mod_dismiss = document.createElement("button");
  mod_dismiss.classList = "btn close";
  mod_dismiss.setAttribute("aria-label", "Close");
  mod_dismiss.setAttribute("data-bs-dismiss", "modal");
  mod_dismiss_span = document.createElement("span");
  mod_dismiss_span.innerHTML = "&times;"
  mod_dismiss_span.setAttribute("aria-hidden", "true");
  mod_dismiss.appendChild(mod_dismiss_span);
  mod_head.appendChild(mod_dismiss);
  if(body != null ){
      mod_body = document.createElement("div");
      mod_body.classList = `modal-body alert alert-${type}`;
      mod_body.appendChild(body);
      mod_cont.appendChild(mod_body);
  }
  if(footer != null){
      if(typeof footer == "string"){
          mod_foot = document.createElement("div");
          mod_foot_sm = document.createElement("small");
          mod_foot_sm.innerHTML = footer;
          mod_foot_sm.classList = "text-muted text-align-right";
          mod_foot.appendChild(mod_foot_sm);
      }else{
          mod_foot = footer;
      }
      mod_foot.classList.add("modal-footer");
      mod_cont.appendChild(mod_foot);
  }
  $('#modal').modal('show');
}

function create_modal_code(code){
  var ed_div = document.createElement("div");
  ed_div.classList = "alert alert-secondary";
  e_pre = document.createElement("pre");
  e_pre.classList = "w-100 border border-white border-2";
  e_pre_h4 = document.createElement("h4");
  e_pre_h4.classList = "my-2 w-100 text-muted";
  e_code = document.createElement("code");
  e_code.classList = "language-r text-muted";
  e_code.innerHTML = code;
  ed_div.appendChild(e_pre_h4);
  e_pre.appendChild(e_code);
  ed_div.appendChild(e_pre);
  return ed_div;
}
