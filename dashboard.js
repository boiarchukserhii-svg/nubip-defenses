(async () => {
  const root = document.getElementById("nubip-defenses-2026");
  const q = selector => root.querySelector(selector);
  const year = q("[data-year]");
  const faculty = q("[data-faculty]");
  const specialty = q("[data-specialty]");
  const status = q("[data-status]");
  const reset = q("[data-reset]");
  const plot = q(".cohort-plot");
  const series = ["Дата минула", "Сьогодні", "Майбутні дати"];
  const color = index => "var(--viz-series-" + (index + 1) + ")";
  const snapshot = await window.loadDefenseData();
  if (!Array.isArray(snapshot.items) || !snapshot.items.length) throw Error("Некоректний формат даних.");
  const kyivDate = new Intl.DateTimeFormat("uk-UA",{timeZone:"Europe/Kyiv",dateStyle:"long"});
  const dateParts = new Intl.DateTimeFormat("en-CA",{
    timeZone:"Europe/Kyiv",year:"numeric",month:"2-digit",day:"2-digit"
  }).formatToParts(new Date());
  const part = name => dateParts.find(value => value.type === name).value;
  const today = [part("year"),part("month"),part("day")].join("-");
  const data = snapshot.items.map(item => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item?.date)) throw Error("Некоректна дата захисту.");
    const degree = item.degree === "PhD" ? "Доктор філософії" : item.degree || "Не вказано";
    const specialty = String(item.specialty ?? "").trim() || "Не вказано";
    const counts = [0,0,0];
    counts[item.date < today ? 0 : item.date === today ? 1 : 2] = 1;
    return [item.date.slice(0,7),degree,specialty,...counts];
  });
  const updated = new Date(snapshot.updated_at);
  q("[data-as-of]").textContent = Number.isFinite(updated.getTime()) ? "Дані оновлено "+kyivDate.format(updated) : "";

  const years = [...new Set(data.map(row => row[0]))].sort();
  const faculties = [...new Set(data.map(row => row[1]))].sort((a,b) => a.localeCompare(b,"uk"));
  const specialties = [...new Set(data.map(row => row[2]))].sort((a,b) => a.localeCompare(b,"uk",{numeric:true}));
  const number = new Intl.NumberFormat("uk-UA");
  const plural = new Intl.PluralRules("uk-UA");
  const defenseLabel = count => ({one:"захист",few:"захисти",many:"захистів"})[plural.select(count)] ?? "захисту";
  const monthName = value => new Intl.DateTimeFormat("uk-UA",{month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(value+"-01T00:00:00Z"));
  for (const value of years) year.add(new Option(monthName(value),value));
  for (const value of faculties) faculty.add(new Option(value,value));
  for (const value of specialties) specialty.add(new Option(value,value));
  series.forEach((label,index) => status.add(new Option(label,String(index))));
  series.forEach((label,index) => {
    const item = document.createElement("span");
    const dot = document.createElement("span");
    dot.className = "legend-dot";
    dot.style.background = color(index);
    dot.setAttribute("aria-hidden","true");
    item.append(dot,label);
    q("[data-legend]").append(item);
  });
  const rows = new Map(years.map(value => {
    const row = document.createElement("div");
    row.className = "cohort-row";
    row.setAttribute("role","listitem");
    const label = document.createElement("span");
    label.textContent = monthName(value);
    const track = document.createElement("div");
    track.className = "cohort-track";
    track.setAttribute("aria-hidden","true");
    const segments = series.map((_,index) => {
      const mark = document.createElement("span");
      mark.className = "cohort-segment";
      mark.style.background = color(index);
      track.append(mark);
      return mark;
    });
    const count = document.createElement("span");
    count.className = "cohort-count tabular-nums";
    row.append(label,track,count);
    plot.append(row);
    return [value,{row,segments,count}];
  }));
  const sum = counts => counts.reduce((total,n) => total+n,0);
  const percent = new Intl.NumberFormat("uk-UA",{style:"percent",maximumFractionDigits:1});
  function donutGroups(groups) {
    const ranked = [...groups].sort(([a,x],[b,y]) => y-x || a.localeCompare(b,"uk"));
    const slices = ranked.slice(0,4).map(([name,n],index) => [name,n,color(index)]);
    const other = sum(ranked.slice(4).map(([,n]) => n));
    if (other) slices.push(["Інші ("+(ranked.length-4)+")",other,color(4)]);
    return slices;
  }
  function renderDonut(selector,entries) {
    const visible = entries.filter(([,n]) => n>0);
    const total = sum(visible.map(([,n]) => n));
    const target = q(selector);
    if (!total) { target.replaceChildren(); return; }
    const ring = document.createElement("div");
    ring.className = "donut-ring";
    ring.setAttribute("aria-hidden","true");
    const center = document.createElement("div");
    center.className = "donut-center tabular-nums";
    const count = document.createElement("strong");
    count.textContent = number.format(total);
    const unit = document.createElement("span");
    unit.className = "text-small";
    unit.textContent = defenseLabel(total);
    center.append(count,unit);
    ring.append(center);
    let cumulative = 0;
    const stops = visible.map(([,n,fill]) => {
      const start = cumulative / total * 100;
      cumulative += n;
      return fill+" "+start+"% "+(cumulative/total*100)+"%";
    });
    ring.style.background = "conic-gradient("+stops.join(",")+")";
    const legend = document.createElement("ul");
    legend.className = "donut-legend text-small";
    for (const [name,n,fill] of visible) {
      const item = document.createElement("li");
      const dot = document.createElement("span");
      dot.className = "legend-dot";
      dot.style.background = fill;
      dot.setAttribute("aria-hidden","true");
      const label = document.createElement("span");
      label.textContent = name;
      const value = document.createElement("span");
      value.className = "donut-value tabular-nums";
      value.textContent = number.format(n)+" · "+percent.format(n/total);
      item.append(dot,label,value);
      legend.append(item);
    }
    target.replaceChildren(ring,legend);
  }
  function render() {
    const byYear = new Map();
    const byFaculty = new Map();
    const bySpecialty = new Map();
    const totals = [0,0,0];
    for (const [value,unit,program,...counts] of data) {
      if ((year.value && String(value) !== year.value) || (faculty.value && unit !== faculty.value)
          || (specialty.value && program !== specialty.value)) continue;
      const selected = counts.map((n,i) => status.value && String(i) !== status.value ? 0 : n);
      const count = sum(selected);
      if (!count) continue;
      const subtotal = byYear.get(value) ?? [0,0,0];
      selected.forEach((n,i) => { subtotal[i] += n; totals[i] += n; });
      byYear.set(value,subtotal);
      byFaculty.set(unit,(byFaculty.get(unit) ?? 0)+count);
      bySpecialty.set(program,(bySpecialty.get(program) ?? 0)+count);
    }
    const max = Math.max(1,...[...byYear.values()].map(sum));
    for (const [value,{row,segments,count}] of rows) {
      const counts = byYear.get(value) ?? [0,0,0];
      row.hidden = !byYear.has(value);
      count.textContent = number.format(sum(counts));
      const details = series.map((label,i) => label + " " + counts[i]).join(", ");
      row.setAttribute("aria-label",monthName(value) + ". " + details);
      segments.forEach((segment,i) => {
        segment.style.width = 100 * counts[i] / max + "%";
        segment.dataset.tooltip = monthName(value) + " · " + series[i] + " · " + number.format(counts[i]) + " " + defenseLabel(counts[i]);
      });
    }
    q("[data-total]").textContent = number.format(sum(totals));
    q("[data-active]").textContent = number.format(totals[0]);
    q("[data-leave]").textContent = number.format(totals[2]);
    q("[data-empty]").hidden = byYear.size > 0;
    q("[data-unit]").hidden = byYear.size === 0;
    q("[data-rankings]").hidden = byYear.size === 0;
    renderDonut("[data-status-donut]",series.map((label,index) => [label,totals[index],color(index)]));
    renderDonut("[data-faculty-ranking]",donutGroups(byFaculty));
    renderDonut("[data-specialty-ranking]",donutGroups(bySpecialty));
    const specialtyRows = [...bySpecialty].sort(([a,x],[b,y]) => y-x || a.localeCompare(b,"uk"));
    q("[data-specialty-list]").replaceChildren(...specialtyRows.map(([name,count]) => {
      const tr = document.createElement("tr");
      const title = document.createElement("td");
      title.textContent = name;
      const value = document.createElement("td");
      value.className = "text-end tabular-nums";
      value.textContent = number.format(count);
      tr.append(title,value);
      return tr;
    }));
    const active = [year.value && monthName(year.value),faculty.value,specialty.value,status.value && series[Number(status.value)]].filter(Boolean);
    q("[data-selection]").textContent = active.length ? "Вибрано · "+active.join(" · ") : "Усі захисти";
    reset.hidden = !active.length;
    q("[data-announcement]").textContent = "Усього захистів " + sum(totals) + ". " + series.map((label,i) => label + " " + totals[i]).join(", ");
  }
  function change() { render(); }
  for (const select of [year,faculty,specialty,status]) select.addEventListener("change",change);
  reset.addEventListener("click",() => {
    for (const select of [year,faculty,specialty,status]) select.value = "";
    change();
    year.focus();
  });
  render();
  root.hidden = false;
  document.getElementById("dashboard-loading").hidden = true;
})().catch(() => {
  document.getElementById("dashboard-loading").textContent =
    "Не вдалося завантажити дані захистів. Спробуйте оновити сторінку.";
});
