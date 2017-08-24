Rails.application.routes.draw do
  resources :statuses
  root "statuses#index"
end
