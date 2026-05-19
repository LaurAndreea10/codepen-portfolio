const feedGrid = document.querySelector("#feedGrid");
const items = [...document.querySelectorAll(".feed-item")];
const searchInput = document.querySelector("#searchInput");
const sourceFilter = document.querySelector("#sourceFilter");
const articleCount = document.querySelector("#articleCount");

const emptyState = document.createElement("div");
emptyState.className = "empty-state";
emptyState.textContent = "No articles match your search yet.";
emptyState.hidden = true;
feedGrid.appendChild(emptyState);

const sources = [
	...new Set(
		items
			.map((item) => item.querySelector(".feed-source")?.textContent.trim())
			.filter(Boolean)
	)
].sort();

sources.forEach((source) => {
	const option = document.createElement("option");
	option.value = source.toLowerCase();
	option.textContent = source;
	sourceFilter.appendChild(option);
});

function normalize(value) {
	return value.toLowerCase().trim();
}

function filterFeed() {
	const query = normalize(searchInput.value);
	const selectedSource = sourceFilter.value;
	let visibleCount = 0;

	items.forEach((item) => {
		const title = item.querySelector("h3")?.textContent || "";
		const source = item.querySelector(".feed-source")?.textContent || "";
		const text = item.textContent || "";

		const matchesSearch = normalize(text).includes(query);
		const matchesSource =
			selectedSource === "all" || normalize(source) === selectedSource;

		const isVisible = matchesSearch && matchesSource;

		item.classList.toggle("is-hidden", !isVisible);

		if (isVisible) visibleCount++;
	});

	articleCount.textContent = visibleCount;
	emptyState.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", filterFeed);
sourceFilter.addEventListener("change", filterFeed);

filterFeed();