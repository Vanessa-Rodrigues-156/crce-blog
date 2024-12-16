import React from "react";
import { Recipe } from "./ui/types";
interface RecipeCardProps {
  recipe: Recipe;
}
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return <div>Recipe Card</div>;
};
export default RecipeCard;
