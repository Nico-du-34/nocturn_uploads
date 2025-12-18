const supportedExtensions = /(\.png|\.jpe?g|\.gif|\.webp|\.svg)$/i;

function autoDetectRepo() {
  const hostMatch = window.location.hostname.match(/^([^.]+)\.github\.io$/i);
  const pathParts = window.location.pathname.split("/").filter(Boolean);

  if (hostMatch) {
    const owner = hostMatch[1];
    const repo = pathParts[0] || `${owner}.github.io`;
    return { owner, repo };
  }

  return {};
}

const detected = autoDetectRepo();
const config = {
  owner: detected.owner || "VOTRE_UTILISATEUR_GITHUB",
  repo: detected.repo || "nocturn_uploads",
  branch: "main",
  folderPath: "images",
};

const gallery = document.querySelector(".gallery");
const statusElement = document.querySelector("[data-status]");
const cardTemplate = document.querySelector("#image-card");

function setStatus(message, tone = "info") {
  statusElement.textContent = message;
  statusElement.dataset.tone = tone;
}

function buildApiUrl() {
  const { owner, repo, branch, folderPath } = config;
  if (!owner || !repo) {
    throw new Error(
      "Configurez le nom d'utilisateur GitHub et le dépôt dans script.js (variables owner et repo)."
    );
  }

  return `https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}?ref=${branch}`;
}

async function fetchImages() {
  const response = await fetch(buildApiUrl(), {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (response.status === 404) {
    throw new Error(
      "Dossier 'images/' introuvable. Créez-le à la racine du dépôt et ajoutez vos fichiers."
    );
  }

  if (!response.ok) {
    throw new Error(`La récupération a échoué (${response.status}).`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("Réponse inattendue de l'API GitHub.");
  }

  return payload
    .filter((item) => item.type === "file" && supportedExtensions.test(item.name))
    .map((item) => ({
      name: item.name,
      url: item.download_url,
      size: item.size,
    }));
}

function createCard(image) {
  const node = cardTemplate.content.cloneNode(true);
  const anchor = node.querySelector("a");
  const img = node.querySelector("img");
  const name = node.querySelector(".card__name");

  anchor.href = image.url;
  img.src = image.url;
  img.alt = image.name;
  name.textContent = image.name;

  return node;
}

async function initGallery() {
  try {
    setStatus("Chargement des images…");
    const images = await fetchImages();

    if (!images.length) {
      setStatus("Aucune image trouvée. Ajoutez vos fichiers dans le dossier images/.");
      return;
    }

    gallery.innerHTML = "";
    images.forEach((image) => gallery.appendChild(createCard(image)));
    setStatus(`${images.length} image(s) prêtes à être ouvertes.`);
  } catch (error) {
    console.error(error);
    setStatus(error.message, "error");
  }
}

initGallery();
