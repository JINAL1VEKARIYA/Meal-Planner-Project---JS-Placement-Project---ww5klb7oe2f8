let btn_generate = document.querySelector("#sub");
// 4b6b8c13891a445185c852a82c9fcf66
let API_KEY = "7d777b8582d949459baa52f870db9c3a";
let height = document.querySelector("#height");
let weight = document.querySelector("#weight");
let age = document.querySelector("#age");
let gender = document.querySelector("#gender");
let Activity = document.querySelector("#Activity");
let display = document.querySelector("#display");
let recipe_detail = document.querySelector("#recipe_detail");
let ingredians_detail = document.querySelector("#ingredians_detail");
let bmr;



const showData = () => {

  if (gender.value === "female") {
    bmr = 655.1 + (9.563 * weight.value) + (1.850 * height.value) - (4.676 * age.value)
  } else if (gender.value === "male") {
    bmr = 66.47 + (13.75 * weight.value) + (5.003 * height.value) - (6.755 * age.value)
  }

  if (Activity.value === "light") {
    bmr = bmr * 1.375;
  }
  else if (Activity.value === "moderate") {
    bmr = bmr * 1.55;
  }
  else if (Activity.value === "high") {
    bmr = bmr * 1.725;
  }

  if (height.value == '' || weight.value == '' || age.value == '') {
    alert("Please fill the detail.")
    return;

  }
  generate_meal_cart(bmr)

}
async function get_recipe(id) {
  let information = "";
  let ingredians="";
  let url=`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=false`
  let res;
  await fetch(url)
  .then((res) => res.json())
  .then((data) => {
    res=data;
    }
  );
  console.log(res);
    // console.log(data.step);
  res.analyzedInstructions[0].steps.map((eve)=>{
    console.log(eve);
    information += `
   
    <div id="informations">
      <ul><li>${eve.step}</li></ul>
    </div>
    `
    recipe_detail.innerHTML = information;
  
  })
  res.extendedIngredients.map((eve)=>{
    console.log(eve);
    ingredians += `
   
    <div id="inf">
      <p>${eve.name}</p>
    </div>
    `
    ingredians_detail.innerHTML = ingredians;
  
  })
    
   
}

async function generate_meal_cart(bmr) {
  let result;
  let html = ""
  await fetch(`https://api.spoonacular.com//mealplanner/generate?timeFrame=day&targetCalories=${bmr}&apiKey=${API_KEY}&includeNutrition=true`)
    .then((res) => res.json())
    .then((data) => {
      result = data;
    }
    );

  console.log(result);
  result.meals.map(async(p) => {

    let url=`https://api.spoonacular.com/recipes/${p.id}/information?apiKey=${API_KEY}&includeNutrition=false`
    // console.log(p.id)
    let imgURL; 
    await fetch(url)
    .then((res) => { return res.json(); })
    .then((data) => { imgURL = data.image; });
    // console.log(p.title);
    // console.log(p.results[0].title);

    html += `
          <div class=meals>
            <div class="card">
                <h2>BreakFast</h2>
                <div class="image">
                    <img src=${imgURL} alt="Breakfast">
                </div>
                <div class="details">
                    <h4>${p.title}</h4>
                    <h5>Calories</h5>
                    <button id="recipe" onclick="get_recipe(${p.id})">Get Recipe</button>
                </div>
            </div>

           
        </div>
          `
    display.innerHTML = html;
  })

}
btn_generate.addEventListener('click', showData);

