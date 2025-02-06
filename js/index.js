if (localStorage.getItem("user") === null) {
  window.location.href = "/login.html";
}

const preco_anuncio = 350;
const taxa_reducao = 0.01;

let valor_a_pagar = preco_anuncio;

getVideos();

document.getElementById("total").innerHTML = valor_a_pagar + " Mt";

document.getElementById("dias").addEventListener("change", (e) => {
  const a =
    (1 + (parseInt(e.target.value) - 1) * taxa_reducao) *
    parseInt(e.target.value);
  valor_a_pagar = Math.ceil((preco_anuncio * (1 + a)) / 2);
  document.getElementById("total").innerHTML = valor_a_pagar + " Mt";
});

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const url = form.get("url");
  const dias = parseInt(form.get("dias"));

  const data = { url, dias, valor_a_pagar };

  try {
    const res = await fetch(api_url + "/panel/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        user: localStorage.getItem("user"),
      },
      body: JSON.stringify(data),
    });

    const ad = await res.json();
    alert("Anúncio submetido com êxito.");
    getVideos();
  } catch (error) {
    console.error(error);
  }
});

async function getVideos() {
  const res = await fetch(api_url + "/panel/videos/", {
    headers: {
      user: localStorage.getItem("user"),
    },
  });
  const videos = await res.json();

  if (videos.length > 0) {
    let trows = "";

    for (const {
      _id,
      url,
      valor_a_pagar,
      dias,
      aproval_status,
      payed,
    } of videos) {
      trows += `<tr>
          <td><a href="${url}" target="_blank">${url}</a></td>
          <td>${dias}</td>
          <td>${valor_a_pagar}</td>
          <td style='color: ${!aproval_status ? "auto" : "green"}'>${
        !aproval_status ? "Aguardando aprovação" : "Aprovado"
      }</td>
          <td>
            <!--<button class='btn-pay' ${
              !aproval_status && "disabled"
            } style='display: ${payed ? "none" : "inline-block"}'>Pagar</button>-->
            <button class='btn-delete' onclick='remove("${_id}")' >Apagar</button></td>
      </tr>`;
    }

    document.getElementById("tbody").innerHTML = trows;
  }
}

async function remove(id) {
  try {
    const res = await fetch(api_url + "/panel/delete/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        user: localStorage.getItem("user"),
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();
    getVideos();
  } catch (error) {
    console.error(error);
  }
}

document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "/login.html";
});
