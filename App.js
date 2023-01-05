let btn_generate = document.querySelector("#sub");
// 4b6b8c13891a445185c852a82c9fcf66
let API_KEY = "3ce9298c607f4739a1349e61ece485fa";
let height = document.querySelector("#height");
let weight = document.querySelector("#weight");
let age = document.querySelector("#age");
let gender = document.querySelector("#gender");
let Activity = document.querySelector("#Activity");
let display = document.querySelector("#display");
let recipe_detail = document.querySelector("#recipe_detail");
let ingredients_detail = document.querySelector("#ingredients_detail");
document.getElementById("recipi-container").style.display = "none";

let bmr;

const showData = () => {
  if (gender.value === "female") {
    bmr =
      655.1 + 9.563 * weight.value + 1.85 * height.value - 4.676 * age.value;
  } else if (gender.value === "male") {
    bmr =
      66.47 + 13.75 * weight.value + 5.003 * height.value - 6.755 * age.value;
  }

  if (Activity.value === "light") {
    bmr = bmr * 1.375;
  } else if (Activity.value === "moderate") {
    bmr = bmr * 1.55;
  } else if (Activity.value === "high") {
    bmr = bmr * 1.725;
  }

  if (height.value == "" || weight.value == "" || age.value == "") {
    alert("Please fill the detail.");
    return;
  }
  generate_meal_cart(bmr);
};
async function get_recipe(id) {
  let information = "";
  let ingredients = "";
  let url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=false`;
  let res;
  await fetch(url)
    .then((res) => res.json())
    .then((data) => {
      res = data;
    });

 document.getElementById("recipi-container").style.display = "flex";
  res.analyzedInstructions[0].steps.map((eve) => {
    console.log(eve);
    information += `
      
      <li>${eve.step}</li>

    `;
    recipe_detail.innerHTML = information;
  });
  res.extendedIngredients.map((eve) => {
    console.log(eve);
    ingredients += `

      <p>${eve.name}</p>

    `;
    ingredients_detail.innerHTML = ingredients;
  });
}

async function generate_meal_cart(bmr) {
  let result;
  let html = "";
  await fetch(
    `https://api.spoonacular.com//mealplanner/generate?timeFrame=day&targetCalories=${bmr}&apiKey=${API_KEY}&includeNutrition=true`
  )
    .then((res) => res.json())
    .then((data) => {
      result = data;
    });

  result.meals.map(async (p) => {
    let url = `https://api.spoonacular.com/recipes/${p.id}/information?apiKey=${API_KEY}&includeNutrition=false`;
    let imgURL;
    await fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        imgURL = data.image;
      });

    html += `
          <div class=meals>
            <div class="card">
                <h2>BreakFast</h2>
                <div class="image">
                    <img src=${imgURL} alt="Breakfast">
                </div>
                <div class="details">
                    <h4>${p.title}</h4>
                    <h5>preparation time ${p.readyInMinutes} minutes</h5>
                    <button id="recipe" onclick="get_recipe(${p.id})">Get Recipe</button>
                </div>
            </div>

           
        </div>
          `;
    display.innerHTML = html;
  });
}
btn_generate.addEventListener("click", showData);
